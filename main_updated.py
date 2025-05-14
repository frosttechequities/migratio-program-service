from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Annotated, Optional

# Import models and clients
from models import UserCreate, UserLogin, TokenData, UserResponse
from supabase_client import get_supabase_client, Client
from gotrue.errors import AuthApiError

# Import profile routes
from profile_routes import router as profile_router

app = FastAPI(
    title="Migratio User Authentication API",
    description="API for user signup, login, and management using Supabase.",
    version="0.1.0"
)

# CORS Middleware Configuration
origins = [
    "http://localhost:5173",  # Origin for your local Vite React dev server
    "http://localhost:3000",  # Common alternative local dev port
    "https://astonishing-smakager-d8c61d.netlify.app",  # Deployed frontend URL
    "https://remarkable-fairy-b57541.netlify.app",  # Alternative deployed frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Using HTTPBearer for simpler token input in Swagger UI
bearer_scheme = HTTPBearer()

# Dependency to get current user from Supabase using JWT
async def get_current_user(
    auth: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)],
    supabase: Client = Depends(get_supabase_client)
) -> UserResponse:
    if auth.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication scheme. Only Bearer is supported.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = auth.credentials
    
    try:
        user_response = supabase.auth.get_user(token)
        
        if user_response.user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated: Invalid token or user not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return UserResponse(
            id=user_response.user.id,
            email=user_response.user.email,
            created_at=str(user_response.user.created_at) if user_response.user.created_at else None
        )
    except AuthApiError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Not authenticated: {e.message}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error validating token: {str(e)}"
        )

@app.post("/auth/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED, summary="Register a new user")
async def signup(user_data: UserCreate, supabase: Client = Depends(get_supabase_client)):
    try:
        response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
        })
        
        if response.user:
            # Supabase might require email confirmation depending on your project settings.
            # The user object is returned upon successful signup.
            return UserResponse(
                id=response.user.id, 
                email=response.user.email,
                created_at=str(response.user.created_at) if response.user.created_at else None
            )
        elif response.session is None and response.user is None:
            # Common for email confirmation pending
            raise HTTPException(
                status_code=status.HTTP_200_OK,  # Or 202 Accepted
                detail="Signup successful, please check your email for confirmation." 
                        if supabase.auth.settings.confirm else "Signup successful but no user object returned."
            )
        else:
            # Should not happen if no error is raised by sign_up
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Signup failed for an unknown reason.")
    except AuthApiError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/auth/login", response_model=TokenData, summary="Login for existing user")
async def login(form_data: UserLogin, supabase: Client = Depends(get_supabase_client)):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": form_data.email,
            "password": form_data.password
        })
        
        if response.session:
            return TokenData(
                access_token=response.session.access_token,
                refresh_token=response.session.refresh_token,
                expires_in=response.session.expires_in
            )
        else:
            # Should not happen if no error is raised by sign_in
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Login failed, user or session not found.")
    except AuthApiError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=e.message,
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/auth/logout", status_code=status.HTTP_204_NO_CONTENT, summary="Logout current user")
async def logout(
    auth: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)],
    supabase: Client = Depends(get_supabase_client)
):
    # The token is in auth.credentials
    if auth.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication scheme."
        )
    
    token = auth.credentials
    
    try:
        supabase.auth.sign_out(token)  # Pass the JWT (auth.credentials) to sign_out
        return  # FastAPI will return 204 No Content by default for None response with this status code
    except AuthApiError as e:
        # Supabase sign_out might not error if token is already invalid,
        # but good to catch potential API errors.
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.get("/auth/me", response_model=UserResponse, summary="Get current authenticated user's details")
async def read_users_me(current_user: UserResponse = Depends(get_current_user)):
    # The get_current_user dependency already fetches and validates the user.
    # If it succeeds, current_user is a valid UserResponse object.
    return current_user

# Include the profile routes
app.include_router(profile_router)

if __name__ == "__main__":
    print("To run this application, use Uvicorn: ")
    print("Example: uvicorn main:app --reload --port 8002")
    print("Ensure your .env file with SUPABASE_URL and SUPABASE_ANON_KEY is in the user_auth_api directory.")
