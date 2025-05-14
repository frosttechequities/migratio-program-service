# Program Service Deployment Guide

This guide provides step-by-step instructions for deploying the Program Service to a production environment.

## Prerequisites

- Docker
- Docker Compose
- Node.js
- MongoDB

## Environment Variables

The following environment variables must be set before deploying the service:

- `MONGODB_URI`: mongodb+srv://migratio_user:securepassword123@cluster0.mongodb.net/migratio_program_service?retryWrites=true&w=majority
- `PROGRAM_SERVICE_PORT`: Port to run the service on
- `NODE_ENV`: Environment (e.g., `production`)
- `CORS_ORIGIN`: CORS origin (e.g., `*`)

## Deployment Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/program-service.git
   ```

2. Navigate to the project directory:
   ```bash
   cd program-service
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the Docker image:
   ```bash
   docker build -t program-service .
   ```

5. Start the service using Docker Compose:
   ```bash
   docker-compose up -d
   ```

## Monitoring

The service can be monitored using the following commands:

- View logs:
  ```bash
   docker-compose logs -f
   ```

- View service status:
  ```bash
   docker-compose ps
   ```

## Troubleshooting

If the service fails to start, check the logs for errors:
```bash
docker-compose logs -f
```

If the service is not responding, check the service status:
```bash
docker-compose ps
```

If the service is not connecting to the database, check the `MONGODB_URI` environment variable.

## API Documentation

The API documentation is available at `http://localhost:3000/docs` (replace `localhost` with the service's IP address if deployed remotely).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
