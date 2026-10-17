from typing import Optional, Dict
from datetime import datetime, timezone
import hashlib
import secrets
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, Header, status

router = APIRouter(prefix="/api/auth", tags=["Authentication & Clearance"])

class LoginRequest(BaseModel):
    username: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=1, max_length=200)
    role: Optional[str] = None

class UserInfo(BaseModel):
    name: str
    username: str
    role: str
    clearance: str
    loggedAt: str

class LoginResponse(BaseModel):
    status: str
    token: str
    user: UserInfo

# In-memory authorized demo profiles with role clearance definitions
AUTHORIZED_ACCOUNTS: Dict[str, Dict[str, str]] = {
    "kalpita.gharat": {
        "name": "Kalpita Gharat",
        "role": "Lead Security Architect",
        "clearance": "Level 4: Full Read/Write & Deployment",
    },
    "faculty.evaluator": {
        "name": "Prof. CIAP Evaluator",
        "role": "CIAP Faculty Evaluator",
        "clearance": "Level 5: Academic Audit & Assessment Verification",
    },
    "soc.analyst": {
        "name": "Senior SOC Risk Analyst",
        "role": "Senior SOC Risk Analyst",
        "clearance": "Level 3: Evaluation & Simulation Access",
    },
}

# Active session tokens map token -> UserInfo
ACTIVE_SESSIONS: Dict[str, UserInfo] = {}

@router.post("/login", response_model=LoginResponse, summary="Authenticate security session")
def login(payload: LoginRequest):
    username_key = payload.username.strip().lower()

    # Check credentials
    if username_key not in AUTHORIZED_ACCOUNTS:
        # Prevent user enumeration with uniform error message
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed. Invalid identity or access credentials."
        )

    # Basic length/complexity check on password
    if len(payload.password.strip()) < 3:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed. Password does not meet security policy."
        )

    account_info = AUTHORIZED_ACCOUNTS[username_key]
    role = payload.role if payload.role else account_info["role"]
    clearance = account_info["clearance"]

    # Generate session token
    token = f"netrisk_sess_{secrets.token_hex(16)}"
    user_info = UserInfo(
        name=account_info["name"],
        username=username_key,
        role=role,
        clearance=clearance,
        loggedAt=datetime.now(timezone.utc).isoformat(),
    )
    ACTIVE_SESSIONS[token] = user_info

    return LoginResponse(
        status="authenticated",
        token=token,
        user=user_info,
    )

@router.get("/me", response_model=UserInfo, summary="Inspect current session clearance")
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required."
        )
    token = authorization.replace("Bearer ", "").strip()
    if token not in ACTIVE_SESSIONS:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid. Please re-authenticate."
        )
    return ACTIVE_SESSIONS[token]

@router.post("/logout", summary="Terminate authenticated security session")
def logout(authorization: Optional[str] = Header(None)):
    if authorization:
        token = authorization.replace("Bearer ", "").strip()
        ACTIVE_SESSIONS.pop(token, None)
    return {"status": "success", "message": "Security session terminated successfully."}
