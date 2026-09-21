#              REQUEST
# Client ─────────────────→ Uvicorn
#                             ↓
#                          FastAPI
#                             ↓
#                        Your function
#                             ↓
#                       JSONResponse
#                             ↓
#                          FastAPI
#                             ↓
#                          Uvicorn
#                             ↓
#              HTTP RESPONSE
# Client ←────────────────────

from  fastapi.responses import JSONResponse 
def custom_response(additional_response:dict,message:str,status_code:int):
    return JSONResponse(
        status_code=status_code,
        content={
            "message": message,
            "additional_response": additional_response
        }
    )