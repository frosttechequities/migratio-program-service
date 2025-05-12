# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install app dependencies
# pdfkit might have native dependencies, consider build-base if needed
# RUN apk add --no-cache build-base python3 make g++
RUN npm install

# Copy the rest of the application's code
COPY . .

# Make port available to the world outside this container (use the service's specific port)
# The actual port mapping is done in docker-compose.yml
# EXPOSE ${PDF_SERVICE_PORT:-3007} # Port defined in docker-compose env

# Define the command to run your app using node
# Ensure your package.json has a "start" script or adjust this command
# This service might have a worker process and an API process.
# This CMD starts the API. The worker might need to be started differently (e.g., separate container or process manager).
CMD [ "npm", "start" ]
