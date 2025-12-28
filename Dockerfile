# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Copy backend files
COPY main.py .
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8000

# Start backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
