# Use an official Python runtime as a parent image, specifying the platform
FROM --platform=linux/amd64 python:3.8-slim

# Set environment variables to make Python print directly to the terminal
# and prevent Python from writing .pyc files to disk
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Set the working directory in the container
WORKDIR /ws

# Copy the current directory contents into the container at /app
COPY . /ws

# Install Flask and Flask-CORS
RUN pip install --no-cache-dir -r requirements.txt


# Make port 5000 available to the world outside this container
EXPOSE 8000

# Start Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:8000", "main:app"]