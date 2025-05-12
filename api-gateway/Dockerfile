FROM node:16-alpine

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the port the gateway will run on (defined in gateway.config.yml or .env)
# The gateway.config.yml has http.port set to 8080
EXPOSE 8080

# Healthcheck (optional, but good practice)
# This assumes a /health endpoint is configured in the gateway.
# The api-gateway-config.md shows a /health endpoint.
# We haven't explicitly configured it in gateway.config.yml yet.
# For now, I'll include it as per the markdown.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1
  # Note: If using Express Gateway's CLI, the health check might need adjustment
  # or be handled by the orchestrator. For `node server.js`, this is okay if
  # the gateway itself exposes /health. Express Gateway does not do this by default.
  # The markdown's example server code (not Express Gateway specific) had /health.
  # I will add a basic health check route to the gateway.config.yml later.

# Command to run the application
CMD ["node", "server.js"]
