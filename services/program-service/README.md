# Migratio Program Service

This service manages immigration program data and country information for the Migratio platform.

## Features

- Country data management
- Immigration program data management
- RESTful API for accessing program and country data

## API Endpoints

### Countries

- `GET /api/countries` - Get all countries
- `GET /api/countries/:idOrCode` - Get a specific country by ID or country code
- `POST /api/countries` - Create a new country (admin only)
- `PUT /api/countries/:idOrCode` - Update a country (admin only)
- `DELETE /api/countries/:idOrCode` - Delete a country (admin only)

### Programs

- `GET /api/programs` - Get all programs
- `GET /api/programs/:id` - Get a specific program by ID
- `POST /api/programs` - Create a new program (admin only)
- `PUT /api/programs/:id` - Update a program (admin only)
- `DELETE /api/programs/:id` - Delete a program (admin only)
- `GET /api/programs/compare?ids=id1,id2,id3` - Compare multiple programs

## Local Development

### Prerequisites

- Node.js (v14+)
- MongoDB

### Setup

1. Clone the repository
2. Navigate to the program-service directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example`:
   ```
   MONGODB_URI=mongodb://localhost:27017/migratio_program_service
   PROGRAM_SERVICE_PORT=3002
   ```
5. Start the service:
   ```
   npm start
   ```
6. For development with auto-reload:
   ```
   npm run dev
   ```

### Database Seeding

To seed the database with sample countries:

```
node scripts/seedCountries.js
```

To seed the database with sample programs:

```
npm run seed
```

## Deployment to Render

### Prerequisites

- A Render account
- A MongoDB Atlas database (or other MongoDB provider)

### Deployment Steps

1. **Create a MongoDB Atlas Database**:
   - Sign up for a MongoDB Atlas account
   - Create a new cluster (free tier is sufficient for testing)
   - Create a database user with read/write permissions
   - Add your IP to the IP Access List (or allow access from anywhere for testing)
   - Get your connection string

2. **Deploy to Render**:
   - Log in to your Render dashboard
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - Name: `migratio-program-service`
     - Root Directory: `services/program-service`
     - Runtime: `Node`
     - Build Command: `npm install`
     - Start Command: `node server.js`
   - Add environment variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `PROGRAM_SERVICE_PORT`: `10000` (Render uses port 10000 by default)
     - `NODE_ENV`: `production`
   - Click "Create Web Service"

3. **Verify Deployment**:
   - Once deployed, visit your service URL (e.g., `https://migratio-program-service.onrender.com/`)
   - You should see "Migratio Program Service is running."
   - Test the API endpoints:
     - `https://migratio-program-service.onrender.com/api/countries`
     - `https://migratio-program-service.onrender.com/api/programs`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/migratio_program_service` |
| `PROGRAM_SERVICE_PORT` | Port for the service | `3002` |
| `NODE_ENV` | Environment (development, production) | `development` |

## License

ISC
