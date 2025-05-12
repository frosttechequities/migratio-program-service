# API Services Summary for Migratio Project (Low Budget Approach)

This document summarizes the key details for the backend API services created and deployed.

## 1. Quiz Data API (`migratio-quiz-api`)

*   **Purpose:** Serves quiz questions.
*   **Technology:** FastAPI, SQLite.
*   **Deployed URL:** [https://migratio-quiz-api.onrender.com](https://migratio-quiz-api.onrender.com)
*   **Live API Docs:** [https://migratio-quiz-api.onrender.com/docs](https://migratio-quiz-api.onrender.com/docs)
*   **Key Endpoints:**
    *   `GET /quiz/questions`: Retrieves all quiz questions.
*   **Database:**
    *   Type: SQLite
    *   Data Source: `quiz_data_api/quiz_data.json` (loaded into `quiz_data.db` within the service).
*   **GitHub Repository:** [https://github.com/frosttechequities/migratio-quiz-service.git](https://github.com/frosttechequities/migratio-quiz-service.git)
*   **Deployment Platform:** Render (Free Tier)

## 2. User Authentication API (`migratio-user-auth`)

*   **Purpose:** Handles user signup, login, and token-based authentication.
*   **Technology:** FastAPI, Supabase (for authentication).
*   **Deployed URL:** [https://migratio-user-auth.onrender.com](https://migratio-user-auth.onrender.com)
*   **Live API Docs:** [https://migratio-user-auth.onrender.com/docs](https://migratio-user-auth.onrender.com/docs)
*   **Key Endpoints:**
    *   `POST /auth/signup`: Register a new user.
    *   `POST /auth/login`: Log in an existing user, returns access/refresh tokens.
    *   `GET /auth/me`: Get details for the currently authenticated user (requires Bearer token).
    *   `POST /auth/logout`: Log out the current user (requires Bearer token).
        *   **Known Issue:** This endpoint currently returns a `500 Internal Server Error` ("string indices must be integers, not 'str'") due to a likely issue in the Supabase Python client library's handling of the logout response. Core auth (signup, login, /me) is unaffected.
*   **Supabase Configuration:**
    *   Project URL: `https://xcjtfkaigogalnytjybk.supabase.co`
    *   Anon Key (public): `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjanRma2FpZ29nYWxueXRqeWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMjQzMTYsImV4cCI6MjA2MjYwMDMxNn0.B5dayJJVA4wFHoCh2TyCbv7p6MDsfIv1BkDki-6ckDA`
    *   These are stored in `user_auth_api/.env` for local development and set as environment variables on Render.
*   **Test User Credentials (used during development/testing):**
    *   Email: `frosttechequities@gmail.com`
    *   Password: `newpassword123`
    *   *(Note: For actual use, ensure strong, unique passwords. Manage test users directly in your Supabase dashboard.)*
*   **GitHub Repository:** [https://github.com/frosttechequities/migratio-user-auth-service.git](https://github.com/frosttechequities/migratio-user-auth-service.git)
*   **Deployment Platform:** Render (Free Tier)

## General Notes

*   **Local Development:** Each service uses Python virtual environments and can be run locally using Uvicorn. Dockerfiles are provided for containerization.
*   **Deployment:** Both services are deployed on Render's free tier, which may cause instances to spin down after inactivity, leading to initial delays on new requests.

This summary should help you keep track of the essential information for these backend services.
