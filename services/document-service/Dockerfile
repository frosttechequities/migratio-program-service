# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install app dependencies
# May need python, make, g++ for node-gyp dependencies if any C++ addons are used (e.g., by some file processing libs)
# RUN apk add --no-cache python3 make g++
RUN npm install

# Copy the rest of the application's code
COPY . .

# Make port available to the world outside this container (use the service's specific port)
# The actual port mapping is done in docker-compose.yml
# EXPOSE ${DOCUMENT_SERVICE_PORT:-3005} # Port defined in docker-compose env

# Define the command to run your app using node
# Ensure your package.json has a "start" script or adjust this command
CMD [ "npm", "start" ]
