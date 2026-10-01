import time
import re
import csv
import io
import base64
import json
from traceback import print_exception

import boto3
from botocore.exceptions import ClientError
from psycopg_pool import ConnectionPool
from psycopg import Error as PsycopgError


# get db info from secrets
def get_db_credentials(secret_name: str):
    session = boto3.session.Session()
    aws_region = "ap-south-1"
    client = session.client(service_name="secretsmanager", region_name=aws_region)

    try:
        secret_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        code = e.response["Error"]["Code"]
        if code == "ResourceNotFoundException":
            print(f"The requested secret {secret_name} was not found")
        elif code == "InvalidRequestException":
            print(f"The request was invalid due to: {e}")
        elif code == "InvalidParameterException":
            print(f"The request had invalid params: {e}")
        elif code == "DecryptionFailure":
            print(f"The requested secret can't be decrypted using the provided KMS key: {e}")
        elif code == "InternalServiceError":
            print(f"An error occurred on service side: {e}")
        raise

    if "SecretString" in secret_response:
        return secret_response["SecretString"]
    return base64.b64decode(secret_response["SecretBinary"]).decode("utf-8")


def get_pool() -> ConnectionPool:
    try:
        secret = json.loads(get_db_credentials("ProdDB"))
        conninfo = (
            f"user={secret['username']} "
            f"password={secret['password']} "
            f"host={secret['host']} "
            f"port={secret['port']} "
            f"dbname={secret['dbname']}"
        )
        pool = ConnectionPool(conninfo=conninfo, min_size=1, max_size=5, timeout=30)
        print("connected via psycopg_pool")
        return pool
    except Exception as e:
        print(f"get-pool exception - {e}")
        print_exception(type(e), e, e.__traceback__)
        raise


pool = get_pool()


def execute_sql_query(query, params=None, fetch="all"):
    while True:
        try:
            with pool.connection() as connection:
                with connection.cursor() as cursor:
                    cursor.execute(query, params)
                    if fetch == "one":
                        return cursor.fetchone()
                    if fetch == "all":
                        return cursor.fetchall()
                    return None
        except (Exception, PsycopgError) as e:
            print(e)
            time.sleep(1)
            continue


def write_csv_to_s3(data_dict, s3_uri):
    # s3://bucket/key
    s3_path = s3_uri.replace("s3://", "", 1)
    bucket, key = s3_path.split("/", 1)

    headers = list(data_dict.keys())
    rows = zip(*(data_dict[h] for h in headers))

    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(headers)
    writer.writerows(rows)

    s3 = boto3.client("s3")
    s3.put_object(Bucket=bucket, Key=key, Body=buffer.getvalue().encode("utf-8"))


# Get list of members who requested to join a money club
query = """WITH latest_kyc AS (
    SELECT DISTINCT ON (mcmemberid) mcmemberid, r1status, kycdoneby
    FROM public.memberkyc
    ORDER BY mcmemberid, kycdoneby DESC
),
pilot_club_date AS (
    SELECT mcmemberid, MIN(mccreateddate) AS pilot_club_accepting_date
    FROM (
        SELECT mcmemberid, mcd.mccreateddate
        FROM mcclubmembers mcm
        INNER JOIN mcclubdetail mcd ON mcd.mcclubid = mcm.mcclubid
        WHERE mcd.mcfrequencytype = 'Daily'
          AND mcd.mcunitamount = 200
          AND NOT EXISTS (
              SELECT 1 FROM mcvirtualclubdetail v WHERE v.mcclubid = mcd.mcclubid
          )

        UNION ALL

        SELECT mcmemberid, mcd.mccreateddate
        FROM originalmcclubmembers mcm
        INNER JOIN mcclubdetail mcd ON mcd.mcclubid = mcm.mcclubid
        WHERE mcd.mcfrequencytype = 'Daily'
          AND mcd.mcunitamount = 200
          AND NOT EXISTS (
              SELECT 1 FROM mcvirtualclubdetail v WHERE v.mcclubid = mcd.mcclubid
          )

        UNION ALL

        SELECT mcmemberid, mcd.mccreateddate
        FROM mcclubmembershistory mcm
        INNER JOIN mcclubdetail mcd ON mcd.mcclubid = mcm.mcclubid
        WHERE mcd.mcfrequencytype = 'Daily'
          AND mcd.mcunitamount = 200
          AND NOT EXISTS (
              SELECT 1 FROM mcvirtualclubdetail v WHERE v.mcclubid = mcd.mcclubid
          )
    ) pilot_data
    GROUP BY mcmemberid
),
filldates AS (
    SELECT mcphonecontactnum, TO_CHAR(mcdatecreated AT TIME ZONE 'Asia/Calcutta', 'YYYY-MM-DD') AS filldate
    FROM webagentregistration
)

SELECT
    j.mcmemberid AS memberid,
    m.mcfirstname || ' ' || m.mclastname AS name,
    m.mcemail AS email,
    m.mcphonecontactnum AS phone,
    j.mcoccupation AS occupation,
    j.mcmotivation AS motivation,
    j.mcmonthlyincome AS income,
    COALESCE(w.mchowknow, wa.mchowknow) AS knowledgesourceaboutmc,
    w.mcreferralcode AS campaigncode,
    TO_CHAR(GREATEST(j.mcdatecreated, w.mcdatecreated, wa.mcdatecreated) AT TIME ZONE 'Asia/Calcutta', 'YYYY-MM-DD') AS dateapplied,
    j.mcapplicationstatus AS status,
    (wa.mcphonecontactnum IS NOT NULL) AS agentlead,
    (w.mcphonecontactnum IS NOT NULL) AS weblead,
    (w.mcphonecontactnum IS NULL AND wa.mcphonecontactnum IS NULL) AS applead,
    l.decile,
    k.r1status,
    k.kycdoneby,
    p.pilot_club_accepting_date,
    d.distinctcontacts AS distinctmembercontacts,
    f.filldate,
    j.mcgender
FROM mcjoinclub j
LEFT JOIN mcmember m ON j.mcmemberid = m.mcmemberid
LEFT JOIN mcverificationl1 mcl ON mcl.mcmemberid = m.mcmemberid
LEFT JOIN leadpredictions l ON l.memberid = m.mcmemberid
LEFT JOIN webregistration w ON m.mcphonecontactnum = w.mcphonecontactnum
LEFT JOIN webagentregistration wa ON m.mcphonecontactnum = wa.mcphonecontactnum
LEFT JOIN latest_kyc k ON k.mcmemberid = j.mcmemberid
LEFT JOIN pilot_club_date p ON p.mcmemberid = j.mcmemberid
LEFT JOIN public.distinctmembercontacts d ON d.memberid = j.mcmemberid
LEFT JOIN filldates f ON f.mcphonecontactnum = m.mcphonecontactnum
WHERE j.mcdatecreated > NOW() - INTERVAL '120 days'

UNION

SELECT
    NULL AS memberid,
    w.mcfirstname || ' ' || w.mclastname AS name,
    w.mcemail,
    w.mcphonecontactnum,
    w.mcoccupation,
    w.mcmotivation,
    CAST(w.mcamount AS CHAR) AS income,
    w.mchowknow,
    w.mcreferralcode,
    TO_CHAR(w.mcdatecreated AT TIME ZONE 'Asia/Calcutta', 'YYYY-MM-DD') AS dateapplied,
    0 AS status,
    FALSE AS agentlead,
    TRUE AS weblead,
    (w.mcphonecontactnum IS NULL) AS applead,
    0 AS decile,
    NULL AS r1status,
    NULL AS kycdoneby,
    NULL AS pilot_club_accepting_date,
    0 AS distinctmembercontacts,
    NULL AS filldate,
    NULL AS gender
FROM webregistration w
WHERE w.mcdatecreated > NOW() - INTERVAL '120 days'
  AND NOT EXISTS (
      SELECT 1 FROM mcmember mem WHERE mem.mcphonecontactnum = w.mcphonecontactnum
  )
  AND NOT EXISTS (
      SELECT 1 FROM webagentregistration webreg WHERE webreg.mcphonecontactnum = w.mcphonecontactnum
  )

UNION

SELECT
    NULL AS memberid,
    wa.mcfirstname || ' ' || wa.mclastname AS name,
    wa.mcemail,
    wa.mcphonecontactnum,
    wa.mcoccupation,
    '' AS motivation,
    CAST(wa.mcmonthlyincome AS CHAR) AS income,
    wa.mchowknow,
    '' AS campaigncode,
    TO_CHAR(wa.mcdatecreated AT TIME ZONE 'Asia/Calcutta', 'YYYY-MM-DD') AS dateapplied,
    0 AS status,
    TRUE AS agentlead,
    FALSE AS weblead,
    (wa.mcphonecontactnum IS NULL) AS applead,
    0 AS decile,
    NULL AS r1status,
    NULL AS kycdoneby,
    NULL AS pilot_club_accepting_date,
    0 AS distinctmembercontacts,
    NULL AS filldate,
    NULL AS gender
FROM webagentregistration wa
LEFT JOIN mcmember m ON wa.mcphonecontactnum = m.mcphonecontactnum
LEFT JOIN mcverificationl1 mcl ON mcl.mcmemberid = m.mcmemberid
LEFT JOIN leadpredictions l ON l.memberid = m.mcmemberid
LEFT JOIN mcjoinclub j ON j.mcmemberid = m.mcphonecontactnum
LEFT JOIN webregistration w ON wa.mcphonecontactnum = w.mcphonecontactnum
WHERE wa.mcdatecreated > NOW() - INTERVAL '120 days'
  AND NOT EXISTS (
      SELECT 1 FROM mcmember mem WHERE mem.mcphonecontactnum = wa.mcphonecontactnum
  )
  AND NOT EXISTS (
      SELECT 1 FROM webregistration webreg WHERE webreg.mcphonecontactnum = wa.mcphonecontactnum
  )

ORDER BY dateapplied DESC;
"""

data = execute_sql_query(query, fetch="all")

# Create empty lists
name_list = []
phone_list = []
occupn_list = []
motiv_list = []
income_list = []
knowledgesourceaboutmc_list = []
applead_list = []
weblead_list = []
agentlead_list = []
decile_list = []
campaigncode_list = []
r1status_list = []
is_agent_referral_list = []
isdownloadapp_list = []
consumer_date_list = []
agent_date_list = []
joinedclubname_list = []
replacestatus_list = []
rounduserreplace_list = []
no_of_contacts_list = []
kyc_done_by_list = []
pilot_club_invite_accept_date_list = []
gender_list = []
nbfc_registered_list = []
first_real_club_name_list = []
first_real_club_current_round_list = []
first_real_club_replacement_status_list = []
second_real_club_name_list = []
second_real_club_current_round_list = []
second_real_club_replacement_status_list = []
third_real_club_name_list = []
third_real_club_current_round_list = []
third_real_club_replacement_status_list = []
current_club_name_list = []
current_club_current_round_list = []
defaulter_list = []
defaulted_clubs_list = []

# Bulk context for the new report fields.
# Existing Non-Referral member-id and filtering logic remains unchanged.
base_member_ids = {row[0] for row in data if row[0] is not None}
phone_numbers = [row[3] for row in data if row[3] is not None]

member_by_phone = {}
if phone_numbers:
    member_rows = execute_sql_query(
        """
        SELECT mcphonecontactnum, mcmemberid
        FROM mcmember
        WHERE mcphonecontactnum = ANY(%s);
        """,
        (phone_numbers,),
        fetch="all"
    )
    member_by_phone = {phone: memberid for phone, memberid in member_rows}

member_ids = sorted(
    base_member_ids |
    {memberid for memberid in member_by_phone.values() if memberid is not None}
)

if member_ids:
    nbfc_rows = execute_sql_query(
        """
        SELECT DISTINCT nmu.mcmemberid
        FROM atl_user au
        INNER JOIN nbfc_mc_user nmu
            ON au.nbfc_mc_user_id = nmu.mcid
        WHERE nmu.mcmemberid = ANY(%s);
        """,
        (member_ids,),
        fetch="all"
    )
    nbfc_members = {row[0] for row in nbfc_rows}

    real_club_rows = execute_sql_query(
        """
        SELECT DISTINCT
            cm.mcmemberid,
            cm.mcclubid,
            cd.mcclubname,
            cd.mccreateddate
        FROM mcclubmembers cm
        INNER JOIN mcclubdetail cd
            ON cm.mcclubid = cd.mcclubid
        INNER JOIN mcbidtransaction bt
            ON bt.mcclubid = cm.mcclubid
            AND bt.sendermemberid = cm.mcmemberid
        WHERE cm.mcmemberid = ANY(%s)
          AND bt.mcbiddingphase = 2
          AND bt.mctransactiontype = 'BID'
          AND bt.mctransfered = 'Y'
          AND bt.mcreceived = 'Y'
          AND cd.mcclubname NOT LIKE 'Pilot%%'
          AND cd.mcclubname NOT LIKE 'SV%%'
          AND cd.mcclubname NOT LIKE 'Virtual%%'
        ORDER BY cd.mccreateddate ASC;
        """,
        (member_ids,),
        fetch="all"
    )

    real_clubs = {}
    for memberid, clubid, clubname, createddate in real_club_rows:
        real_clubs.setdefault(memberid, []).append({
            "clubid": clubid,
            "clubname": clubname,
            "createddate": createddate
        })

    real_club_ids = {
        club["clubid"]
        for clubs in real_clubs.values()
        for club in clubs
    }

    first_real_club_defaults = {}
    if real_club_ids:
        default_rows = execute_sql_query(
            """
            SELECT
                ds.mcmemberid,
                ds.mcclubid,
                ds.status
            FROM defaults ds
            WHERE ds.mcmemberid = ANY(%s)
              AND ds.mcclubid = ANY(%s);
            """,
            (member_ids, list(real_club_ids)),
            fetch="all"
        )

        for memberid, clubid, status in default_rows:
            first_real_club_defaults.setdefault(
                (memberid, clubid), []
            ).append(status)

        real_club_round_rows = execute_sql_query(
            """
            SELECT
                mcclubid,
                MAX(mcbiddingphase) AS current_round
            FROM mcclubbiddingdetail
            WHERE mcclubid = ANY(%s)
            GROUP BY mcclubid;
            """,
            (list(real_club_ids),),
            fetch="all"
        )
        real_club_rounds = {row[0]: row[1] for row in real_club_round_rows}
    else:
        real_club_rounds = {}

    current_club_rows = execute_sql_query(
        """
        SELECT DISTINCT ON (cm.mcmemberid)
            cm.mcmemberid,
            cm.mcclubid,
            cd.mcclubname
        FROM mcclubmembers cm
        INNER JOIN mcclubdetail cd
            ON cm.mcclubid = cd.mcclubid
        WHERE cm.mcmemberid = ANY(%s)
        ORDER BY cm.mcmemberid, cm.mccreateddate DESC;
        """,
        (member_ids,),
        fetch="all"
    )
    current_clubs = {
        memberid: {"clubid": clubid, "clubname": clubname}
        for memberid, clubid, clubname in current_club_rows
    }

    current_club_ids = {
        club["clubid"]
        for club in current_clubs.values()
        if club["clubid"] is not None
    }

    if current_club_ids:
        current_club_round_rows = execute_sql_query(
            """
            SELECT
                mcclubid,
                MAX(mcbiddingphase) AS current_round
            FROM mcclubbiddingdetail
            WHERE mcclubid = ANY(%s)
            GROUP BY mcclubid;
            """,
            (list(current_club_ids),),
            fetch="all"
        )
        current_club_rounds = {row[0]: row[1] for row in current_club_round_rows}
    else:
        current_club_rounds = {}

    defaulter_rows = execute_sql_query(
        """
        SELECT
            ds.mcmemberid,
            ds.mcclubid,
            ds.status,
            cd.mcclubname
        FROM defaults ds
        LEFT JOIN mcclubdetail cd
            ON ds.mcclubid = cd.mcclubid
        WHERE ds.mcmemberid = ANY(%s);
        """,
        (member_ids,),
        fetch="all"
    )

    defaulter_info = {}
    for memberid, clubid, status, clubname in defaulter_rows:
        defaulter_info.setdefault(
            memberid,
            {"is_defaulter": False, "defaulted_clubs": set()}
        )
        if status not in ("optout", "investor"):
            defaulter_info[memberid]["is_defaulter"] = True
            if clubname:
                defaulter_info[memberid]["defaulted_clubs"].add(clubname)
else:
    nbfc_members = set()
    real_clubs = {}
    real_club_rounds = {}
    first_real_club_defaults = {}
    current_clubs = {}
    current_club_rounds = {}
    defaulter_info = {}

# Fetch and process each row in the result set
for row in data:
    memberid = row[0] if row[0] is not None else 0
    name = row[1]
    phone = row[3]
    occupn = row[4]
    motiv = row[5]
    income = row[6]
    knowledgesourceaboutmc = row[7]
    campaigncode = row[8]
    decile = row[14] if row[14] is not None else "n/a"
    agentlead = 1 if row[11] else 0
    weblead = 1 if row[12] else 0
    applead = 1 if row[13] else 0
    isdownloadapp = 1 if memberid != 0 else 0
    gender = row[-1] if row[-1] is not None else "n/a"

    if memberid == 0:
        getmemid_qry = "SELECT mcmemberid FROM mcmember WHERE mcphonecontactnum = %s"
        getmemid_row = execute_sql_query(getmemid_qry, (phone,), fetch="one")
        memberid = (getmemid_row[0] if getmemid_row and getmemid_row[0] is not None else 0)

    nbfc_registered = "Yes" if memberid in nbfc_members else "No"

    member_real_clubs = real_clubs.get(memberid, [])

    first_real_club_name = (
        member_real_clubs[0]["clubname"] if len(member_real_clubs) > 0 else "NULL"
    )
    first_real_club_current_round = (
        real_club_rounds.get(member_real_clubs[0]["clubid"], "NULL")
        if len(member_real_clubs) > 0 else "NULL"
    )
    first_real_club_replacement_status = "NULL"

    if len(member_real_clubs) > 0:
        statuses = first_real_club_defaults.get(
            (memberid, member_real_clubs[0]["clubid"]), []
        )
        if statuses:
            if all(status == "optout" for status in statuses):
                first_real_club_replacement_status = "optout"
            elif all(status == "investor" for status in statuses):
                first_real_club_replacement_status = "investor"
            else:
                first_real_club_replacement_status = "defaulter"

    second_real_club_name = (
        member_real_clubs[1]["clubname"] if len(member_real_clubs) > 1 else "NULL"
    )
    second_real_club_current_round = (
        real_club_rounds.get(member_real_clubs[1]["clubid"], "NULL")
        if len(member_real_clubs) > 1 else "NULL"
    )
    second_real_club_replacement_status = "NULL"

    if len(member_real_clubs) > 1:
        statuses = first_real_club_defaults.get(
            (memberid, member_real_clubs[1]["clubid"]), []
        )
        if statuses:
            if all(status == "optout" for status in statuses):
                second_real_club_replacement_status = "optout"
            elif all(status == "investor" for status in statuses):
                second_real_club_replacement_status = "investor"
            else:
                second_real_club_replacement_status = "defaulter"

    third_real_club_name = (
        member_real_clubs[2]["clubname"] if len(member_real_clubs) > 2 else "NULL"
    )
    third_real_club_current_round = (
        real_club_rounds.get(member_real_clubs[2]["clubid"], "NULL")
        if len(member_real_clubs) > 2 else "NULL"
    )
    third_real_club_replacement_status = "NULL"

    if len(member_real_clubs) > 2:
        statuses = first_real_club_defaults.get(
            (memberid, member_real_clubs[2]["clubid"]), []
        )
        if statuses:
            if all(status == "optout" for status in statuses):
                third_real_club_replacement_status = "optout"
            elif all(status == "investor" for status in statuses):
                third_real_club_replacement_status = "investor"
            else:
                third_real_club_replacement_status = "defaulter"

    current_club = current_clubs.get(memberid)
    current_club_name = current_club["clubname"] if current_club else "NULL"
    current_club_current_round = (
        current_club_rounds.get(current_club["clubid"], "NULL")
        if current_club else "NULL"
    )

    member_defaulter_info = defaulter_info.get(memberid)
    defaulter = (
        "Yes"
        if member_defaulter_info and member_defaulter_info["is_defaulter"]
        else "No"
    )
    defaulted_clubs = (
        ", ".join(sorted(member_defaulter_info["defaulted_clubs"]))
        if member_defaulter_info and member_defaulter_info["defaulted_clubs"]
        else "NULL"
    )

    # Query for referral information
    query_referral = """SELECT 
        ma.mcmemberid AS agentid,
        rm.mcreferredmemberid
    FROM mcreferredmembers rm
    LEFT JOIN mcmemberagent ma 
        ON ma.mcmemberid = rm.mcreferralmemberid
    WHERE rm.mcreferredmemberid = %s;
    """
    referral_row = execute_sql_query(query_referral, (memberid,), fetch="one")

    is_agent = referral_row[0] if referral_row is not None else None
    is_member = referral_row[1] if referral_row is not None else None

    # Determine if it's an agent referral
    is_agent_referral = "n/a"
    if is_agent is not None:
        is_agent_referral = "1"
    elif is_member is not None:
        is_agent_referral = "0"
    if is_agent_referral in ("1", "0"):
        continue

    agent_date = row[19] if row[19] is not None else "n/a"

    # Query for consumer fill date
    query_consumer_fill_date = """SELECT 
        TO_CHAR(mcdatecreated AT TIME ZONE 'Asia/Calcutta', 'YYYY-MM-DD') AS filldate
    FROM webregistration
    WHERE mcphonecontactnum = %s;
    """
    consumer_row = execute_sql_query(query_consumer_fill_date, (phone,), fetch="one")
    consumer_date = consumer_row[0] if consumer_row and consumer_row[0] is not None else "n/a"

    if consumer_row is None:
        query_consumer = """SELECT 
        TO_CHAR(mcdatecreated AT TIME ZONE 'Asia/Calcutta', 'YYYY-MM-DD') AS filldate
        FROM mcjoinclub
        WHERE mcmemberid = %s
        """
        consumer_row_new = execute_sql_query(query_consumer, (memberid,), fetch="one")
        consumer_date = (
            consumer_row_new[0] if consumer_row_new and consumer_row_new[0] is not None else "n/a"
        )

    if agent_date != "n/a" and consumer_date != "n/a" and agent_date < consumer_date:
        consumer_date = " "

    # Query to get club name
    query_get_club_name = """
    SELECT cd.mcclubname
    FROM mcclubmembers cm
    LEFT JOIN mcclubdetail cd ON cm.mcclubid = cd.mcclubid
    WHERE cd.mcstatus IN ('CREATED', 'CLOSED')
      AND cd.mcunitamount = 200
      AND cd.mcfrequencytype = 'Daily'
      AND cm.mcmemberid = %s
      AND NOT EXISTS (
          SELECT 1 
          FROM mcvirtualclubdetail v 
          WHERE v.mcclubid = cd.mcclubid
      )
    ORDER BY cm.mccreateddate DESC
    LIMIT 1
    """
    clubnamerow = execute_sql_query(query_get_club_name, (memberid,), fetch="one")
    joinedclubname = clubnamerow[0] if clubnamerow and clubnamerow[0] is not None else "n/a"

    if clubnamerow is None:
        query_get_club_name_new = """SELECT cd.mcclubname
        FROM mcclubmembers cm
        LEFT JOIN mcclubdetail cd ON cm.mcclubid = cd.mcclubid
        WHERE cd.mcstatus IN ('CREATED', 'CLOSED')
          AND cm.mcmemberid = %s
          AND NOT EXISTS (
              SELECT 1 
              FROM mcvirtualclubdetail v 
              WHERE v.mcclubid = cd.mcclubid
          )
        ORDER BY cm.mccreateddate ASC
        LIMIT 1;"""
        clubnamerow_new = execute_sql_query(query_get_club_name_new, (memberid,), fetch="one")
        joinedclubname = (
            clubnamerow_new[0] if clubnamerow_new and clubnamerow_new[0] is not None else "n/a"
        )

        if clubnamerow_new is None:
            query_default_clubname = """SELECT mcd.mcclubname
            FROM defaults ds
            INNER JOIN mcclubdetail mcd ON ds.mcclubid = mcd.mcclubid
            WHERE ds.mcmemberid = %s
            ORDER BY ds.defaultdate ASC
            LIMIT 1;
            """
            default_clubname_row = execute_sql_query(query_default_clubname, (memberid,), fetch="one")
            joinedclubname = (
                default_clubname_row[0]
                if default_clubname_row and default_clubname_row[0] is not None
                else "n/a"
            )

    replacestatus = " "
    rounduserreplace = " "
    if memberid != 0 and clubnamerow is None:
        query_getdef_pilot = """SELECT ds.mcclubid, mcd.mcclubname
        FROM defaults ds
        INNER JOIN mcclubdetail mcd ON ds.mcclubid = mcd.mcclubid
        WHERE ds.mcmemberid = %s
          AND mcd.mcstatus IN ('CREATED', 'CLOSED')
          AND mcd.mcclubname NOT LIKE 'Virtual%%'
          AND mcd.mcunitamount = 200
          AND mcd.mcfrequencytype = 'Daily'
        ORDER BY ds.defaultdate DESC
        LIMIT 1;
        """
        getdef_pilot_row = execute_sql_query(query_getdef_pilot, (memberid,), fetch="one")

        if getdef_pilot_row is not None:
            mcclubidchkdefault = getdef_pilot_row[0]

            chkdef_qry = """SELECT COUNT(mcid) AS count
            FROM defaults
            WHERE mcclubid = %s
            AND mcmemberid = %s
            """
            chkdef_row = execute_sql_query(chkdef_qry, (mcclubidchkdefault, memberid), fetch="one")
            countfordef = chkdef_row[0]

            replacestatus = " "
            rounduserreplace = " "
            print("mcclubidchkdefault", mcclubidchkdefault)

            if countfordef > 0:
                joinedclubname = getdef_pilot_row[1]

                optout_qry = """SELECT MAX(mcbiddingphase) AS phase
                FROM mcbidtransaction
                WHERE mcclubid = %s
                AND sendermemberid = %s
                """
                optout_row = execute_sql_query(optout_qry, (mcclubidchkdefault, memberid), fetch="one")
                countoptout = optout_row[0]

                if countoptout is None:
                    continue

                if countoptout == 1:
                    optout_count_qry = """SELECT COUNT(mcid) AS count
                    FROM mcbidtransaction
                    WHERE mcclubid = %s
                    AND sendermemberid = %s
                    AND receivermemberid != 12345
                    AND mctransfered = 'N'
                    AND mcreceived = 'N'
                    """
                    optout_count_row = execute_sql_query(
                        optout_count_qry, (mcclubidchkdefault, memberid), fetch="one"
                    )
                    iscountoptout = optout_count_row[0]

                    if iscountoptout > 0:
                        replacestatus = "OptOut"
                        rounduserreplace = "1"
                    else:
                        chk_default_status_qry = """SELECT COUNT(mcid) AS count
                        FROM mcbidtransaction
                        WHERE mcclubid = %s
                        AND (sendermemberid = %s OR receivermemberid = %s)
                        AND (mctransfered = 'N' OR mcreceived = 'N')
                        AND mcbiddingphase = %s
                        """
                        default_status_row = execute_sql_query(
                            chk_default_status_qry,
                            (mcclubidchkdefault, memberid, memberid, countoptout),
                            fetch="one",
                        )
                        defaultcount = default_status_row[0]

                        if defaultcount > 0:
                            replacestatus = "Defaulter"
                            rounduserreplace = countoptout
                        else:
                            replacestatus = "n/a"
                            rounduserreplace = "n/a"
                else:
                    default_check_qry = """SELECT COUNT(*) AS count
                    FROM mcbidtransaction
                    WHERE mcclubid = %s
                    AND sendermemberid = %s
                    AND receivermemberid = 12345
                    AND mcbiddingphase = %s
                    """
                    optout_default_check_row = execute_sql_query(
                        default_check_qry, (mcclubidchkdefault, memberid, countoptout), fetch="one"
                    )
                    countfordefchk = optout_default_check_row[0]

                    if countfordefchk > 0:
                        chk_default_status_qry = """SELECT COUNT(mcid) AS count
                        FROM mcbidtransaction
                        WHERE mcclubid = %s
                        AND (sendermemberid = %s OR receivermemberid = %s)
                        AND (mctransfered = 'N' OR mcreceived = 'N')
                        AND mcbiddingphase = %s
                        """
                        default_status_row = execute_sql_query(
                            chk_default_status_qry,
                            (mcclubidchkdefault, memberid, memberid, countoptout),
                            fetch="one",
                        )
                        defaultcount = default_status_row[0]

                        if defaultcount > 0:
                            replacestatus = "Defaulter"
                            rounduserreplace = countoptout
                        else:
                            replacestatus = "n/a"
                            rounduserreplace = "n/a"
                    else:
                        past_win_qry = """SELECT COUNT(mcid) AS count
                        FROM mcclubbiddingdetail
                        WHERE mcclubid = %s
                        AND mcbidderid = %s
                        """
                        past_win_row = execute_sql_query(
                            past_win_qry, (mcclubidchkdefault, memberid), fetch="one"
                        )
                        pastcount = past_win_row[0]

                        if pastcount > 0:
                            chk_default_status_qry = """SELECT COUNT(mcid) AS count
                            FROM mcbidtransaction
                            WHERE mcclubid = %s
                            AND (sendermemberid = %s OR receivermemberid = %s)
                            AND (mctransfered = 'N' OR mcreceived = 'N')
                            AND mcbiddingphase = %s
                            """
                            default_status_row = execute_sql_query(
                                chk_default_status_qry,
                                (mcclubidchkdefault, memberid, memberid, countoptout),
                                fetch="one",
                            )
                            defaultcount = default_status_row[0]

                            if defaultcount > 0:
                                replacestatus = "Defaulter"
                                rounduserreplace = countoptout
                            else:
                                replacestatus = "n/a"
                                rounduserreplace = "n/a"
                        else:
                            chk_investor_qry = """SELECT COUNT(mcid) AS count
                            FROM mcbidtransaction
                            WHERE mcclubid = %s
                            AND sendermemberid = %s
                            AND mctransfered = 'N'
                            AND mcreceived = 'N'
                            AND mcbiddingphase = %s
                            """
                            investor_qry_row = execute_sql_query(
                                chk_investor_qry, (mcclubidchkdefault, memberid, countoptout), fetch="one"
                            )
                            investorcount = investor_qry_row[0]

                            if investorcount > 0:
                                replacestatus = "Investor"
                                rounduserreplace = countoptout
                            else:
                                replacestatus = "n/a"
                                rounduserreplace = "n/a"

    kyc_done_by = row[16] if row[16] is not None else "n/a"
    kyc_done_by = re.sub(r"\[[^\[\]]*\]", "", kyc_done_by)

    r1status = row[15]
    if r1status is None or r1status == 0:
        r1status = "n/a"
    elif r1status == 1:
        r1status = "Approved"
    elif r1status == 2:
        r1status = "Rejected"
    elif r1status == 3:
        r1status = "Unreachable"
    elif r1status == 4:
        r1status = "Eligible but not interested"
    elif r1status == 5:
        r1status = "Will join later"

    pilot_club_invite_accept_date = row[17] if row[17] is not None else "n/a"
    pilot_club_invite_accept_date = str(pilot_club_invite_accept_date)[:10]

    no_of_contacts = row[18] if row[18] is not None else "n/a"

    name_list.append(name)
    phone_list.append(phone)
    occupn_list.append(occupn)
    motiv_list.append(motiv)
    income_list.append(income)
    knowledgesourceaboutmc_list.append(knowledgesourceaboutmc)
    applead_list.append(applead)
    weblead_list.append(weblead)
    agentlead_list.append(agentlead)
    decile_list.append(decile)
    campaigncode_list.append(campaigncode)
    r1status_list.append(r1status)
    is_agent_referral_list.append(is_agent_referral)
    isdownloadapp_list.append(isdownloadapp)
    consumer_date_list.append(consumer_date)
    agent_date_list.append(agent_date)
    joinedclubname_list.append(joinedclubname)
    replacestatus_list.append(replacestatus)
    rounduserreplace_list.append(rounduserreplace)
    no_of_contacts_list.append(no_of_contacts)
    kyc_done_by_list.append(kyc_done_by)
    pilot_club_invite_accept_date_list.append(pilot_club_invite_accept_date)
    gender_list.append(gender)
    nbfc_registered_list.append(nbfc_registered)
    first_real_club_name_list.append(first_real_club_name)
    first_real_club_current_round_list.append(first_real_club_current_round)
    first_real_club_replacement_status_list.append(first_real_club_replacement_status)
    second_real_club_name_list.append(second_real_club_name)
    second_real_club_current_round_list.append(second_real_club_current_round)
    second_real_club_replacement_status_list.append(second_real_club_replacement_status)
    third_real_club_name_list.append(third_real_club_name)
    third_real_club_current_round_list.append(third_real_club_current_round)
    third_real_club_replacement_status_list.append(third_real_club_replacement_status)
    current_club_name_list.append(current_club_name)
    current_club_current_round_list.append(current_club_current_round)
    defaulter_list.append(defaulter)
    defaulted_clubs_list.append(defaulted_clubs)

data_dict = {
    "Name": name_list,
    "Mobile": phone_list,
    "Gender": gender_list,
    "Occupation": occupn_list,
    "Motivation": motiv_list,
    "Income": income_list,
    "Source of lead": knowledgesourceaboutmc_list,
    "app lead": applead_list,
    "web lead": weblead_list,
    "agent lead": agentlead_list,
    "decile": decile_list,
    "Campaign name": campaigncode_list,
    "R1 Status of lead": r1status_list,
    "Agent Referral or not": is_agent_referral_list,
    "Web formed filled + app downloaded": isdownloadapp_list,
    "Date of filling Consumer Form": consumer_date_list,
    "Date of filling Agent Form": agent_date_list,
    "Real club name": joinedclubname_list,
    "Replacement Status": replacestatus_list,
    "Round of the club in which the user was replaced": rounduserreplace_list,
    "Number of Contacts": no_of_contacts_list,
    "Last R1 KYC done by (agent name)": kyc_done_by_list,
    "Date of accepting Pilot Club invitation": pilot_club_invite_accept_date_list,
    "NBFC Registered": nbfc_registered_list,
    "First Real Club Name": first_real_club_name_list,
    "First Real Club Current Round": first_real_club_current_round_list,
    "First Real Club Replacement Status": first_real_club_replacement_status_list,
    "Second Real Club Name": second_real_club_name_list,
    "Second Real Club Current Round": second_real_club_current_round_list,
    "Second Real Club Replacement Status": second_real_club_replacement_status_list,
    "Third Real Club Name": third_real_club_name_list,
    "Third Real Club Current Round": third_real_club_current_round_list,
    "Third Real Club Replacement Status": third_real_club_replacement_status_list,
    "Current Club Name": current_club_name_list,
    "Current Club Current Round": current_club_current_round_list,
    "Defaulter": defaulter_list,
    "Defaulted Clubs": defaulted_clubs_list,
}

# Upload CSV to S3 (without pandas)
write_csv_to_s3(
    data_dict,
    # "s3://aws-glue-mc/data_file/non_referral_leads_details_marketing_team/non_referral_leads_details_marketing_team.csv",
    "s3://moneyclubreportsdev/reports/non_referral_leads_details_marketing_team/non_referral_leads_details_marketing_team.csv",
)

pool.close()
