FROM python:3.12-slim

WORKDIR /app

# Install poetry
RUN pip install --no-cache-dir poetry==1.8.2

# Copy poetry files
COPY pyproject.toml poetry.lock* ./

# Configure poetry to not create virtual env (we're in a container)
RUN poetry config virtualenvs.create false

# Install dependencies
RUN poetry install --no-interaction --no-ansi

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "src.mandelbrot.app:app", "--host", "0.0.0.0", "--port", "8000"]
