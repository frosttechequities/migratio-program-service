# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the requirements file into the container at /usr/src/app
COPY requirements.txt ./

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application's code into the container at /usr/src/app
COPY . .

# Make port 5002 available to the world outside this container
# This should match the port in .env.example and app.py
EXPOSE 5002

# Define environment variable for the port (can be overridden)
ENV DOCUMENT_ANALYSIS_SERVICE_PORT=5002
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Run app.py when the container launches using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5002", "app:app"]
