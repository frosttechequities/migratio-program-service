# Plan: Next Step - User Authentication Service (Low-Budget)

This document outlines the plan for the next development phase: creating a User Authentication service for the Migratio platform. This service will handle user registration, login, and basic profile management, leveraging a Backend-as-a-Service (BaaS) for its authentication features to align with our low-budget, rapid development strategy.

## 1. Objective

*   Implement core user authentication features (signup, login, logout, get current user).
*   Utilize a BaaS provider (Supabase or Firebase) for secure and free user management.
*   Create a FastAPI wrapper service that interacts with the BaaS, providing a consistent API style for our backend.
*   Deploy this service using a free-tier option (e.g., Render, Google Cloud Run).

## 2. Service Overview: User Authentication API

*   **Functionality:**
    *   User registration (email/password).
    *   User login (email/password), returning a session token (e.g., JWT provided by BaaS).
    *   User logout (invalidating session if applicable via BaaS).
    *   Endpoint to get the current authenticated user's basic details.
    *   (Future: Password reset, email verification, social logins - can be added later using BaaS features).
*   **Technology Choices:**
    *   **Language/Framework:** Python with FastAPI.
    *   **Authentication Backend:** Supabase (PostgreSQL + GoTrue for auth) or Firebase Authentication. Both have generous free tiers. Let's lean towards **Supabase** for this plan due to its PostgreSQL backend which can be useful for relational data later if needed, though Firebase is also excellent.
    *   **Database (for user profiles beyond auth):** The chosen BaaS will handle auth user data. Additional user profile data could be stored in its associated database (Postgres for Supabase, Firestore for Firebase) or in our existing MongoDB Atlas if preferred (though keeping auth-related user data with the auth provider is often simpler). For this initial service, we'll focus on auth; profile data storage can be a subsequent step.
    *   **Deployment:** Render (free tier) or Google Cloud Run (free tier).
    *   **Containerization:** Docker.

## 3. Development Steps

### Step 3.1: Set up BaaS (Supabase Example)
*   **User Action:** Create a free account at [supabase.com](https://supabase.com).
*   **User Action:** Create a new project in Supabase.
*   **User Action:** Familiarize yourself with Supabase Authentication. Note your Project URL and `anon` key (public key) from the Supabase project settings (API section). **You will need these for the FastAPI service.** Supabase also provides a service role key for admin operations from the backend, which might be needed.

### Step 3.2: Define Data Models (Pydantic)
*   `UserCreate`: For registration (email, password).
*   `UserLogin`: For login (email, password).
*   `Token`: For returning JWT and refresh token from BaaS.
*   `UserResponse`: For returning basic user info (e.g., ID, email, created_at from BaaS).

### Step 3.3: Develop FastAPI Application (`user_auth_api/`)
*   Create a new directory `user_auth_api/` for this service.
*   Initialize a FastAPI project within it.
*   **Environment Variables:** Plan for `SUPABASE_URL` and `SUPABASE_KEY` (and potentially `SUPABASE_SERVICE_ROLE_KEY`).
*   **Supabase Client:** Use the official `supabase-py` Python library to interact with your Supabase project.
    *   Initialize the Supabase client in your FastAPI app (e.g., on startup or per request).
*   **Endpoints:**
    *   `POST /auth/signup`:
        *   Takes `UserCreate` model.
        *   Calls Supabase client's `auth.sign_up()` method.
        *   Returns user info and session/token or appropriate error.
    *   `POST /auth/login`:
        *   Takes `UserLogin` model.
        *   Calls Supabase client's `auth.sign_in_with_password()` method.
        *   Returns user info and session/token (JWT) or appropriate error.
    *   `POST /auth/logout` (Requires token):
        *   Calls Supabase client's `auth.sign_out()` method.
        *   Requires the user's JWT to be passed in the Authorization header.
    *   `GET /auth/me` (Requires token):
        *   Takes JWT from Authorization header.
        *   Calls Supabase client's `auth.get_user()` method using the token.
        *   Returns `UserResponse` or error if token is invalid/expired.
*   **Dependency Injection for Auth:** Implement FastAPI dependencies to protect routes that require authentication (e.g., to extract and validate JWT from headers).

### Step 3.4: Containerize with Docker
*   Create a `Dockerfile` for the `user_auth_api` service (similar to the `quiz_data_api` one).
*   Create `requirements.txt` (will include `fastapi`, `uvicorn`, `supabase-py`, `python-dotenv`, `pydantic`).

### Step 3.5: Local Testing
*   Set up `.env` in `user_auth_api/` with `SUPABASE_URL` and `SUPABASE_KEY`.
*   Run locally using Uvicorn.
*   Test signup, login, get user (me), logout endpoints using the `/docs` UI or an API client.
*   Verify users are created in your Supabase project's Authentication section.

### Step 3.6: Deploy to Render (or chosen platform)
*   Push the `user_auth_api` code to a new GitHub repository (e.g., `migratio-user-auth-service`) or as a new folder in an existing monorepo.
*   Deploy to Render as a new Web Service (Docker runtime), similar to the `quiz_data_api`.
*   **Crucially, set the `SUPABASE_URL` and `SUPABASE_KEY` (and `SUPABASE_SERVICE_ROLE_KEY` if used) as environment variables in Render.**

### Step 3.7: Test Deployed API
*   Use the public Render URL to test all authentication endpoints.

## 4. What You Need to Provide for This Next Step:

1.  **Set up a Supabase Account and Project (Step 3.1):**
    *   Create the account and a new project.
    *   Locate your Supabase **Project URL** and **`anon` (public) key**. You'll find these in your Supabase project settings under "API".
    *   (Optional but recommended for some backend operations: also note the `service_role` key).
2.  **Confirmation of Deployment Platform:** We'll assume Render again unless you specify otherwise. If so, you'll need your Render account.

## 5. Future Considerations for this Service:

*   Storing additional user profile data (name, preferences, etc.) either in Supabase's Postgres database or linking the Supabase Auth User ID to a profile in your MongoDB Atlas.
*   Implementing password reset flows.
*   Adding email verification.
*   Integrating social logins (Google, GitHub, etc.) via Supabase.

This User Authentication service will be a critical component, enabling user-specific experiences for other features like saving quiz progress, personalized roadmaps, and document management.
