FROM python:3.11-slim

# Install system dependencies for matplotlib and other libs
RUN apt-get update && \
    apt-get install -y build-essential libfreetype6-dev libpng-dev pkg-config && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only requirements first for better caching
COPY requirements-deploy.txt ./

RUN python -m pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements-deploy.txt

# Copy application code
COPY . /app

ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
