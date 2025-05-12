# Development Environment Setup

This document outlines the setup process for the Migratio development environment, ensuring consistency across the development team and alignment with the production architecture.

## Overview

The Migratio development environment is designed to mirror the production architecture while optimizing for developer productivity. We use Docker for containerization to ensure consistency across environments and simplify onboarding of new developers.

## Prerequisites

All developers should have the following tools installed:

- **Git**: Version control system
- **Node.js**: v16.x or later
- **npm**: v8.x or later
- **Docker**: Latest stable version
- **Docker Compose**: Latest stable version
- **MongoDB Compass**: For database visualization (optional)
- **Visual Studio Code**: Recommended IDE with extensions:
  - ESLint
  - Prettier
  - Docker
  - MongoDB for VS Code
  - GitLens
  - EditorConfig

## Repository Structure

The Migratio codebase is organized as a monorepo with the following structure:

```
migratio/
├── client/               # Frontend React application
├── server/               # Backend Node.js services
│   ├── api-gateway/      # API Gateway service
│   ├── user-service/     # User management service
│   ├── assessment/       # Assessment quiz service
│   ├── recommendation/   # Recommendation engine service
│   ├── pdf-service/      # PDF generation service
│   ├── program-service/  # Immigration program service
│   └── shared/           # Shared utilities and models
├── infrastructure/       # Infrastructure as code and deployment configs
├── docs/                 # Documentation
└── scripts/              # Development and build scripts
```

## Initial Setup

1. **Clone the Repository**

```bash
git clone https://github.com/migratio/migratio.git
cd migratio
```

2. **Install Dependencies**

```bash
# Install root dependencies
npm install

# Install service-specific dependencies
npm run bootstrap
```

3. **Environment Configuration**

Copy the example environment files:

```bash
cp .env.example .env
cp client/.env.example client/.env
cp server/api-gateway/.env.example server/api-gateway/.env
# Repeat for other services
```

Edit the `.env` files with your local configuration values.

4. **Start Development Environment**

```bash
# Start all services
docker-compose up -d

# Or start specific services
docker-compose up -d mongodb redis api-gateway user-service
```

5. **Initialize Database**

```bash
# Run database migrations and seed data
npm run db:setup
```

## Docker Compose Configuration

The development environment uses Docker Compose to orchestrate the following services:

- **MongoDB**: Document database
- **Redis**: Caching and session storage
- **API Gateway**: Entry point for all API requests
- **User Service**: User management and authentication
- **Assessment Service**: Quiz engine
- **Recommendation Service**: Matching algorithm
- **PDF Service**: Document generation
- **Program Service**: Immigration program data
- **Client Dev Server**: Frontend development server

The `docker-compose.yml` file defines these services with appropriate port mappings, volume mounts, and environment variables.

## Local Development Workflow

1. **Start the Environment**

```bash
docker-compose up -d
```

2. **Run Frontend Development Server**

```bash
cd client
npm run dev
```

3. **Access the Application**

- Frontend: http://localhost:3000
- API Gateway: http://localhost:8000
- Service-specific endpoints: See service documentation

4. **Making Changes**

- Frontend changes will automatically reload
- Backend changes require service restart:
  ```bash
  docker-compose restart <service-name>
  ```
- Database changes should be made through migrations:
  ```bash
  npm run db:migrate:create -- --name=add_new_field
  npm run db:migrate:up
  ```

5. **Running Tests**

```bash
# Run all tests
npm test

# Run specific service tests
npm test -- --scope=user-service

# Run with coverage
npm test -- --coverage
```

## Database Setup

The development environment includes a MongoDB instance with the following configuration:

- **Host**: localhost
- **Port**: 27017
- **Database**: migratio_dev
- **Username**: migratio_dev
- **Password**: See .env file

Initial seed data is provided for:
- Countries
- Sample immigration programs
- Test users
- Occupation codes

## API Documentation

The API Gateway service includes Swagger documentation accessible at:
http://localhost:8000/api-docs

This documentation is automatically generated from code annotations and provides interactive testing capabilities.

## Troubleshooting

### Common Issues

1. **Port Conflicts**

If you encounter port conflicts, edit the `docker-compose.yml` file to map to different host ports.

2. **Docker Container Issues**

```bash
# View container logs
docker-compose logs <service-name>

# Restart a specific service
docker-compose restart <service-name>

# Rebuild a service
docker-compose up -d --build <service-name>
```

3. **Database Connection Issues**

Ensure MongoDB is running:
```bash
docker-compose ps mongodb
```

Check connection settings in service `.env` files.

4. **Node Module Issues**

```bash
# Clean node_modules and reinstall
npm run clean
npm run bootstrap
```

## Development Guidelines

1. **Code Style**

The project uses ESLint and Prettier for code formatting. Configuration files are included in the repository.

```bash
# Check code style
npm run lint

# Fix automatically
npm run lint:fix
```

2. **Commit Messages**

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: formatting changes
refactor: code changes without functionality changes
test: add or update tests
chore: maintenance tasks
```

3. **Branching Strategy**

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/xxx`: Feature branches
- `fix/xxx`: Bug fix branches
- `release/x.x.x`: Release preparation branches

4. **Pull Request Process**

- Create feature branch from `develop`
- Implement changes with tests
- Submit PR to `develop`
- Ensure CI passes
- Obtain code review approval
- Merge using squash and merge

## Continuous Integration

The project uses GitHub Actions for CI/CD with the following workflows:

- **Pull Request Checks**: Runs on all PRs to verify code quality and tests
- **Develop Deployment**: Deploys to staging environment when merged to `develop`
- **Production Deployment**: Deploys to production when merged to `main`

CI configuration files are located in `.github/workflows/`.

## Next Steps

After setting up the development environment:

1. Review the architecture documentation
2. Explore the codebase structure
3. Run the application and review existing features
4. Check the issue tracker for current tasks
5. Join the development team communication channels
