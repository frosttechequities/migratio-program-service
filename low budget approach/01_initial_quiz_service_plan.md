# Plan: Initial Backend Service - Quiz Data API (Low-Budget)

This document outlines the plan for the first development step in aligning the Migratio project with the "Full Features with a Low-Budget Tech Stack" strategy. We will create a new, simple backend service to manage and serve quiz questions.

## 1. Objective

*   Introduce Python (FastAPI) into the backend stack.
*   Utilize a free-tier NoSQL database (MongoDB Atlas).
*   Deploy the service using a free-tier container hosting platform (e.g., Google Cloud Run or Render).
*   Create a foundational API that the future Assessment Engine can consume.

## 2. Service Overview: Quiz Data API

*   **Functionality:**
    *   Store and manage quiz questions (text, type, options, section, order).
    *   Provide API endpoints to retrieve all quiz questions or questions by section/ID.
*   **Technology Choices:**
    *   **Language/Framework:** Python with FastAPI (for robust API development, automatic docs, Pydantic data validation).
    *   **Database:** MongoDB Atlas (M0 Free Tier - 512MB storage).
    *   **Deployment:** Google Cloud Run (has a generous free tier for containerized applications) or Render (free tier for web services).
    *   **Containerization:** Docker.

## 3. Development Steps

### Step 3.1: Define Data Model (Pydantic & MongoDB)
*   Define a Pydantic model for a `QuizQuestion` including fields like:
    *   `question_id` (string, unique)
    *   `text` (string)
    *   `question_type` (string, e.g., "single_choice", "multiple_choice", "text_input")
    *   `options` (list of strings, optional)
    *   `section` (string, e.g., "personal_info", "education")
    *   `order` (integer, for display sequence within a section)
    *   `is_active` (boolean, default true)
*   This model will guide the structure of documents in MongoDB.

### Step 3.2: Set up MongoDB Atlas
*   **User Action:** Create a free MongoDB Atlas account.
*   **User Action:** Set up an M0 cluster (free tier).
*   **User Action:** Create a database (e.g., `migratio_quiz_db`) and a collection (e.g., `questions`).
*   **User Action:** Configure database user credentials with read/write access to this collection.
*   **User Action:** Get the MongoDB connection string (SRV address). **You will need to provide this connection string to me securely when we implement the service.**

### Step 3.3: Develop FastAPI Application
*   Initialize a FastAPI project.
*   Implement CRUD-like operations (initially focusing on Create/Read):
    *   `POST /questions/`: Endpoint to add a new question (for admin/seeding initially).
    *   `GET /questions/`: Endpoint to retrieve all active questions, optionally filterable by `section`.
    *   `GET /questions/{question_id}/`: Endpoint to retrieve a specific question by its ID.
*   Integrate MongoDB connection using a library like `motor` (asynchronous MongoDB driver for FastAPI) or `pymongo` (synchronous, simpler if async is not critical for this small service initially).
*   Implement basic error handling.

### Step 3.4: Create Sample Quiz Data
*   Prepare a small set of sample quiz questions (e.g., 5-10 questions covering different types and sections) in JSON format.
*   Write a simple Python script (or use the `POST /questions/` endpoint via an API tool) to populate the MongoDB `questions` collection with this sample data.

### Step 3.5: Containerize with Docker
*   Create a `Dockerfile` for the FastAPI application.
*   Ensure it includes all dependencies and correctly runs the application (e.g., using Uvicorn).
*   Build and test the Docker image locally.

### Step 3.6: Deploy to Free Tier Hosting
*   **User Action:** Create an account on Google Cloud Platform (GCP) for Cloud Run or Render.
*   **Deployment to Google Cloud Run (Example):**
    1.  **User Action:** Create a new GCP project if you don't have one.
    2.  **User Action:** Enable the Cloud Run API and Container Registry API.
    3.  Push the Docker image to Google Container Registry (GCR) or Artifact Registry.
    4.  Deploy the image to Cloud Run, configuring:
        *   Service name (e.g., `quiz-data-api`).
        *   Region.
        *   Allow unauthenticated invocations (for public API access initially).
        *   Set environment variables (e.g., `MONGODB_CONNECTION_STRING` - **this should be configured securely, ideally using secrets management if the platform supports it, or as an environment variable for this initial step**).
        *   Configure CPU allocation (can be set to minimum during idle for free tier).
*   **Deployment to Render (Alternative):**
    1.  Connect your GitHub repository (containing the FastAPI app and Dockerfile) to Render.
    2.  Create a new "Web Service" on Render.
    3.  Point to your repository and specify Docker deployment.
    4.  Set environment variables (including `MONGODB_CONNECTION_STRING`).
    5.  Render will build and deploy. The free tier will spin down after inactivity.

### Step 3.7: Test Deployed API
*   Once deployed, use an API client (like Postman, Insomnia, or `curl`) to test the live endpoints.

## 4. What You Need to Provide for This First Step:

1.  **Confirmation of Preferred Deployment Platform (for this service):**
    *   Google Cloud Run (requires GCP account setup, enabling APIs, and using Container Registry).
    *   Render (requires Render account, connecting GitHub).
    *   Or, if you prefer another option from the low-budget list for Python/Docker apps (like Fly.io).
2.  **Once MongoDB Atlas is set up (Step 3.2):**
    *   The MongoDB SRV connection string (to be provided securely when I'm ready to write the code that uses it).
3.  **Sample Quiz Questions (Step 3.4):**
    *   A small list of questions (e.g., in JSON format or just text I can format) so we have data to work with. Example:
        ```json
        [
          {
            "text": "What is your primary immigration goal?",
            "question_type": "single_choice",
            "options": ["Work", "Study", "Join Family", "Invest", "Seek Asylum"],
            "section": "goals",
            "order": 1
          },
          {
            "text": "Which countries are you most interested in?",
            "question_type": "multiple_choice",
            "options": ["Canada", "USA", "UK", "Australia", "Germany"],
            "section": "preferences",
            "order": 1
          }
        ]
        ```

## 5. Next Steps (After this service is built)

*   Integrate this Quiz Data API with the Assessment Engine (either a new Python one or the existing Node.js one initially).
*   Begin development of other core services or frontend components based on priority.

This initial service will provide a tangible piece of the backend, built and deployed using the low-budget principles, and set a pattern for subsequent services.
