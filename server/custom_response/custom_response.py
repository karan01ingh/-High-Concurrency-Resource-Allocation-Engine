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
from fastapi.encoders import jsonable_encoder
def custom_response(status_code:int,message:str,additional_response:dict):
    
    return JSONResponse(
        status_code=status_code,
        content=jsonable_encoder({
            "message": message,
            "additional_response": additional_response
        })
    )