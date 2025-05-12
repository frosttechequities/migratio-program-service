FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies in a separate layer for better caching
COPY package*.json ./
RUN npm ci --legacy-peer-deps --include=dev --prefer-offline

# Copy app source code
COPY . .

# Expose port
EXPOSE 3000

# Add node_modules/.bin to the PATH
ENV PATH /app/node_modules/.bin:$PATH

# Start the app
CMD ["npm", "start"]
