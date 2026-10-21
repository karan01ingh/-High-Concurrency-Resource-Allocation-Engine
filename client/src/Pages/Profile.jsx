
import { useState } from "react";

const initialProfile = {
  name: "Karan Singh",
  email: "karan@example.com",
  phone: "+91 98765 43210",
  dob: "2003-03-15",
  gender: "Male",
  location: "Jabalpur, Madhya Pradesh, India",
};

const categories = [
  { name: "Music", icon: "♫", color: "purple" },
  { name: "Food & Drinks", icon: "♨", color: "orange" },
  { name: "Travel", icon: "✈", color: "blue" },
  { name: "Tech", icon: "▣", color: "green" },
];

function Card({ children, className = "" }) {
  return (
    <section
      className={`min-w-0 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-xs leading-5 text-slate-500">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

function SmallButton({ children, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
        danger
          ? "border-red-300 text-red-600 hover:bg-red-50"
          : "border-slate-300 text-slate-700 hover:border-emerald-600 hover:text-emerald-700"
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
        checked ? "bg-emerald-700" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function InfoRow({ icon, label, children }) {
  return (
    <div className="grid grid-cols-[24px_minmax(105px,0.7fr)_minmax(0,1.3fr)] items-center gap-3 border-b border-slate-100 py-2.5 last:border-0">
      <span className="text-lg text-slate-500" aria-hidden="true">{icon}</span>
      <span className="text-sm text-slate-500">{label}</span>
      <div className="min-w-0 break-words text-sm font-medium text-slate-800">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [preferencesEditing, setPreferencesEditing] = useState(false);
  const [favorites, setFavorites] = useState(["Music", "Food & Drinks", "Travel", "Tech"]);
  const [locations, setLocations] = useState(["Goa", "Delhi", "Mumbai", "Bengaluru", "Jabalpur"]);
  const [notifications, setNotifications] = useState(true);
  const [marketing, setMarketing] = useState(true);
  const [connectedAccounts, setConnectedAccounts] = useState({
    Google: true,
    Facebook: false,
    Apple: false,
  });
  const [twoFactor, setTwoFactor] = useState(false);
  const [dialog, setDialog] = useState("");
  const [notice, setNotice] = useState("");
  const [avatar, setAvatar] = useState("");

  function updateProfile(key, value) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function toggleFavorite(name) {
    setFavorites((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  }

  function toggleLocation(name) {
    setLocations((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  }

  function handleAvatar(e) {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setAvatar(URL.createObjectURL(file));
    }
  }

  function saveProfile() {
    setEditing(false);
    setNotice("Profile changes are currently saved in this page only.");
  }

  function handleDelete() {
    setDialog("");
    setNotice("Account deletion requires a connected backend API.");
  }

  const joinedDate = "12 Jan 2025";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* User sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white/80 px-4 py-5 lg:block">
          <div className="flex items-center gap-3 px-2">
            <div className="flex size-14 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              {avatar ? (
                <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{profile.name}</p>
              <p className="mt-1 truncate text-xs text-slate-500">{profile.email}</p>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="mt-1 text-xs font-medium text-emerald-700 underline"
              >
                View Profile
              </button>
            </div>
          </div>

          <nav className="mt-7 space-y-1.5">
            {[
              ["▦", "Dashboard"],
              ["♢", "My Bookings"],
              ["♙", "My Rewards"],
              ["♧", "Wallet & Coins"],
              ["♙", "Profile"],
              ["⚙", "Settings"],
            ].map(([icon, label]) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  if (label === "Profile") window.scrollTo({ top: 0, behavior: "smooth" });
                  else setNotice(`${label} page can be connected when that route is added.`);
                }}
                className={`flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-sm font-medium ${
                  label === "Profile"
                    ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="text-xl">{icon}</span>
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setNotice("Logout will be connected to authentication.")}
              className="mt-5 flex w-full items-center gap-4 px-4 py-3 text-sm font-medium text-red-500"
            >
              <span className="text-xl">⇥</span> Logout
            </button>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 xl:px-7">
          <div className="mb-5">
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your personal information, preferences, and account settings.
            </p>
          </div>

          {notice && (
            <div role="status" className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              {notice}
              <button type="button" onClick={() => setNotice("")} aria-label="Dismiss">×</button>
            </div>
          )}

          {/* Profile summary + account summary */}
          <div className="grid gap-4 2xl:grid-cols-[1.2fr_0.95fr]">
            <Card>
              <div className="flex flex-wrap items-center gap-5">
                <div className="relative">
                  <div className="flex size-28 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 sm:size-32">
                    {avatar ? (
                      <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-5xl">👤</span>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 flex size-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-slate-600 text-lg text-white hover:bg-slate-700">
                    <span aria-hidden="true">📷</span>
                    <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
                  </label>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">✓ Verified</span>
                  </div>
                  <div className="mt-3 space-y-2.5 text-sm text-slate-600">
                    <p>✉ <span className="ml-2">{profile.email}</span></p>
                    <p>♧ <span className="ml-2">{profile.phone}</span></p>
                    <p>♧ <span className="ml-2">{profile.location}</span></p>
                    <p>▦ <span className="ml-2">Joined on {joinedDate}</span></p>
                  </div>
                </div>

                <SmallButton onClick={() => setEditing(!editing)}>✎ Edit Profile</SmallButton>
              </div>

              {editing && (
                <form
                  className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveProfile();
                  }}
                >
                  <Field label="Full Name" required>
                    <input className={inputClass} required value={profile.name} onChange={(e) => updateProfile("name", e.target.value)} />
                  </Field>
                  <Field label="Email Address" required>
                    <input type="email" className={inputClass} required value={profile.email} onChange={(e) => updateProfile("email", e.target.value)} />
                  </Field>
                  <Field label="Phone Number">
                    <input className={inputClass} value={profile.phone} onChange={(e) => updateProfile("phone", e.target.value)} />
                  </Field>
                  <Field label="Date of Birth">
                    <input type="date" className={inputClass} value={profile.dob} onChange={(e) => updateProfile("dob", e.target.value)} />
                  </Field>
                  <Field label="Gender">
                    <select className={inputClass} value={profile.gender} onChange={(e) => updateProfile("gender", e.target.value)}>
                      {["Male", "Female", "Non-binary", "Prefer not to say"].map((g) => <option key={g}>{g}</option>)}
                    </select>
                  </Field>
                  <Field label="Location">
                    <input className={inputClass} value={profile.location} onChange={(e) => updateProfile("location", e.target.value)} />
                  </Field>
                  <div className="flex gap-2 sm:col-span-2">
                    <button type="submit" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Save Changes</button>
                    <SmallButton onClick={() => setEditing(false)}>Cancel</SmallButton>
                  </div>
                </form>
              )}
            </Card>

            <Card>
              <SectionHeading
                title="Account Summary"
                action={<button type="button" onClick={() => setNotice("Dashboard route can be added later.")} className="text-xs font-semibold text-emerald-700">View Dashboard →</button>}
              />
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["🟡", "2,000", "EventCoins Balance"],
                  ["🎟️", "6", "Total Bookings"],
                  ["🎁", "500", "Rewards Earned"],
                  ["♡", String(favorites.length), "Favorite Categories"],
                ].map(([icon, value, label]) => (
                  <div key={label} className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow-sm">{icon}</span>
                    <div className="min-w-0">
                      <p className="text-xl font-bold">{value}</p>
                      <p className="text-xs leading-5 text-slate-500">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Personal info + preferences */}
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <Card>
              <SectionHeading
                title="Personal Information"
                action={<button type="button" onClick={() => setEditing(!editing)} className="text-xs font-medium text-slate-600 hover:text-emerald-700">✎ Edit</button>}
              />
              <InfoRow icon="♙" label="Full Name">{profile.name}</InfoRow>
              <InfoRow icon="✉" label="Email Address">
                {profile.email} <span className="ml-2 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">✓ Verified</span>
              </InfoRow>
              <InfoRow icon="♧" label="Phone Number">
                {profile.phone} <span className="ml-2 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">✓ Verified</span>
              </InfoRow>
              <InfoRow icon="▦" label="Date of Birth">
                {profile.dob ? new Date(`${profile.dob}T12:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Not added"}
              </InfoRow>
              <InfoRow icon="♙" label="Gender">{profile.gender}</InfoRow>
              <InfoRow icon="♧" label="Location">{profile.location}</InfoRow>
            </Card>

            <Card>
              <SectionHeading
                title="Event Preferences"
                action={<button type="button" onClick={() => setPreferencesEditing(!preferencesEditing)} className="text-xs font-medium text-slate-600 hover:text-emerald-700">✎ {preferencesEditing ? "Done" : "Edit"}</button>}
              />

              <div className="mb-5">
                <p className="mb-3 text-sm font-semibold">♡ Favorite Categories</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const active = favorites.includes(category.name);
                    const colors = {
                      purple: "border-purple-200 bg-purple-50 text-purple-700",
                      orange: "border-orange-200 bg-orange-50 text-orange-700",
                      blue: "border-blue-200 bg-blue-50 text-blue-700",
                      green: "border-emerald-200 bg-emerald-50 text-emerald-700",
                    };
                    return (
                      <button
                        type="button"
                        key={category.name}
                        disabled={!preferencesEditing}
                        onClick={() => toggleFavorite(category.name)}
                        className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${colors[category.color]} ${!active ? "opacity-40" : ""} ${preferencesEditing ? "cursor-pointer hover:opacity-75" : "cursor-default"}`}
                      >
                        <span className="mr-2">{category.icon}</span>{category.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-5">
                <p className="mb-3 text-sm font-semibold">♧ Preferred Locations</p>
                <div className="flex flex-wrap gap-2">
                  {["Goa", "Delhi", "Mumbai", "Bengaluru", "Jabalpur"].map((city) => (
                    <button
                      type="button"
                      key={city}
                      disabled={!preferencesEditing}
                      onClick={() => toggleLocation(city)}
                      className={`rounded-full px-3 py-2 text-xs font-medium transition ${locations.includes(city) ? "bg-slate-100 text-slate-700" : "bg-slate-50 text-slate-400"} ${preferencesEditing ? "cursor-pointer hover:ring-1 hover:ring-emerald-400" : "cursor-default"}`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-5 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">♧ Event Notifications</p>
                    <p className="mt-1 text-xs text-slate-500">Get notified about new events, offers, and updates.</p>
                  </div>
                  <Toggle checked={notifications} onChange={setNotifications} label="Event notifications" />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">✉ Marketing Communications</p>
                    <p className="mt-1 text-xs text-slate-500">Receive promotional emails and personalized recommendations.</p>
                  </div>
                  <Toggle checked={marketing} onChange={setMarketing} label="Marketing communications" />
                </div>
              </div>
            </Card>
          </div>

          {/* Linked accounts, security, danger zone */}
          <div className="mt-4 grid gap-4 xl:grid-cols-3">
            <Card>
              <SectionHeading title="Linked Accounts" subtitle="Connect your social accounts for a faster login experience." />
              {[
                ["Google", "G", "text-red-500"],
                ["Facebook", "f", "text-blue-600"],
                ["Apple", "●", "text-slate-900"],
              ].map(([name, icon, color]) => (
                <div key={name} className="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0">
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-2xl font-bold ${color}`}>{icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {connectedAccounts[name] ? (name === "Google" ? profile.email : "Connected") : "Not connected"}
                    </p>
                  </div>
                  {connectedAccounts[name] ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">✓ Linked</span>
                  ) : (
                    <SmallButton onClick={() => setNotice(`${name} sign-in requires provider OAuth configuration.`)}>Connect</SmallButton>
                  )}
                </div>
              ))}
            </Card>

            <Card>
              <SectionHeading title="Account Security" subtitle="Keep your account safe and secure." />
              <div className="flex items-center gap-3 border-b border-slate-100 py-3">
                <span className="text-2xl">♙</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Password</p>
                  <p className="mt-1 text-xs text-slate-500">Last updated 12 Jan 2025</p>
                </div>
                <SmallButton onClick={() => setDialog("password")}>Change</SmallButton>
              </div>
              <div className="flex items-center gap-3 border-b border-slate-100 py-3">
                <span className="text-2xl">⬡</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Two-Factor Authentication</p>
                  <p className="mt-1 text-xs text-slate-500">{twoFactor ? "Extra security is enabled." : "Add an extra layer of security."}</p>
                </div>
                <SmallButton onClick={() => setTwoFactor(!twoFactor)}>{twoFactor ? "Disable" : "Enable"}</SmallButton>
              </div>
              <div className="flex items-center gap-3 py-3">
                <span className="text-2xl">▣</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Active Sessions</p>
                  <p className="mt-1 text-xs text-slate-500">Manage your logged-in devices.</p>
                </div>
                <SmallButton onClick={() => setDialog("sessions")}>View</SmallButton>
              </div>
            </Card>

            <Card>
              <SectionHeading title="Danger Zone" subtitle="Permanently delete your account and all data." />
              <div className="rounded-lg border border-red-100 bg-red-50 p-3">
                <p className="text-sm font-semibold text-red-700">▤ Delete Account</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  This action cannot be undone. Your data, bookings, and EventCoins may be permanently deleted.
                </p>
                <button
                  type="button"
                  onClick={() => setDialog("delete")}
                  className="mt-3 w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                >
                  Delete My Account
                </button>
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Confirmation dialogs */}
      {dialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
          >
            <h2 className="text-lg font-bold">
              {dialog === "delete"
                ? "Delete Account?"
                : dialog === "password"
                  ? "Change Password"
                  : "Active Sessions"}
            </h2>

            {dialog === "delete" ? (
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Account deletion is permanent. The real deletion action should be performed by the backend after authentication and confirmation.
              </p>
            ) : dialog === "password" ? (
              <div className="mt-4 space-y-3">
                <input type="password" autoComplete="current-password" placeholder="Current password" className={inputClass} />
                <input type="password" autoComplete="new-password" placeholder="New password" className={inputClass} />
                <input type="password" autoComplete="new-password" placeholder="Confirm new password" className={inputClass} />
                <p className="text-xs text-slate-500">Password changes require a secure backend endpoint.</p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600">
                Session management will show devices and allow revocation when connected to the backend.
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <SmallButton onClick={() => setDialog("")}>Cancel</SmallButton>
              {dialog === "delete" && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
                >
                  Confirm
                </button>
              )}
              {dialog === "password" && (
                <button
                  type="button"
                  onClick={() => {
                    setDialog("");
                    setNotice("Connect the password update API to save changes securely.");
                  }}
                  className="rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
