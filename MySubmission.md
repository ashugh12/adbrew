# Adbrew Test - Submission

## Overview

This project implements a full-stack TODO application using React (frontend), Django REST Framework (backend), and MongoDB (database), all containerized with Docker. The application allows users to create and view TODO items through a web interface.

## Repository

The complete source code is available at: [https://github.com/ashugh12/adbrew.git](https://github.com/ashugh12/adbrew.git)

### Cloning the Repository

To clone this repository, use the following command:

```bash
git clone https://github.com/ashugh12/adbrew.git
cd adbrew/adb_test
```

Or if you prefer SSH:

```bash
git clone git@github.com:ashugh12/adbrew.git
cd adbrew/adb_test
```

## Architecture

The application consists of three separate Docker containers:

1. **API Container** - Django REST Framework backend (Python 3.8)
2. **App Container** - React frontend (Node.js 16)
3. **Mongo Container** - MongoDB 5.0 database

## Key Changes and Improvements

### 1. Separate Dockerfiles

Instead of using a single Dockerfile, I created separate Dockerfiles for better separation of concerns:

- **`Dockerfile.api`**: Optimized for Python/Django backend
  - Uses `python:3.8-slim-bullseye` base image
  - Installs build dependencies (gcc, build-essential) for compiling Python packages
  - Pins pip to version 23.3.2 to avoid compatibility issues with older packages
  - Installs all Python dependencies from `requirements.txt`

- **`Dockerfile.app`**: Optimized for React frontend
  - Uses `node:16` base image
  - Configures yarn registry for reliable package installation
  - Uses layer caching by copying package files first
  - Sets up proper working directory structure

### 2. MongoDB Container Configuration

- Uses official `mongo:5.0` image (upgraded from 4.4)
- Configured with proper volume mounting for data persistence
- Set to bind to all interfaces (`0.0.0.0`) for container communication

### 3. Python 3.8 Compatibility Fixes

Python 3.8 had compatibility issues with newer versions of pandas and numpy. I resolved this by:

- **Pinning pip version**: `pip==23.3.2` (newer pip versions reject packages with invalid metadata)
- **Using compatible package versions**:
  - `numpy==1.22.4` (compatible with Python 3.8 and pandas 1.5.3)
  - `pandas==1.5.3` (works with numpy 1.22.4)
- **Installing build dependencies**: Added `gcc` and `build-essential` to compile packages that don't have pre-built wheels

### 4. Environment Variables

Added proper environment variable configuration in `docker-compose.yml`:
- `MONGO_HOST=mongo` (service name for Docker networking)
- `MONGO_PORT=27017` (MongoDB default port)

### 5. Frontend Implementation

- **React Hooks**: Used `useState` and `useEffect` hooks (no class components)
- **API Integration**: 
  - Fetches todos on component mount
  - Creates new todos via POST request
  - Optimistically updates UI after successful creation
- **Error Handling**: Added proper error checking for API responses
- **Semantic HTML**: Used proper `<ul>` and `<li>` tags for the todo list

### 6. Backend Implementation

- **Django REST Framework**: Implemented `TodoListView` APIView
- **MongoDB Integration**: Direct connection using PyMongo
- **Error Handling**: Comprehensive try-catch blocks with proper HTTP status codes
- **CSRF Exemption**: Added `@csrf_exempt` decorator for API endpoints
- **Data Format**: Converts MongoDB `_id` (ObjectId) to string `id` for frontend compatibility

## Project Structure

```
adb_test/
├── Dockerfile.api          # Backend container definition
├── Dockerfile.app          # Frontend container definition
├── docker-compose.yml      # Multi-container orchestration
├── src/
│   ├── app/                # React frontend
│   │   ├── src/
│   │   │   └── App.js      # Main React component
│   │   ├── package.json
│   │   └── yarn.lock
│   ├── rest/               # Django backend
│   │   ├── manage.py
│   │   └── rest/
│   │       ├── views.py    # API endpoints
│   │       ├── urls.py     # URL routing
│   │       └── settings.py # Django settings
│   └── requirements.txt   # Python dependencies
└── db/                     # MongoDB data (created at runtime)
```

## Setup Instructions

### Prerequisites

- Docker and Docker Compose installed
- Environment variable `ADBREW_CODEBASE_PATH` set to point to the `src` directory

### Steps

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/ashugh12/adbrew.git
   cd adbrew/adb_test
   ```

2. **Set the environment variable**:
   ```bash
   export ADBREW_CODEBASE_PATH="$(pwd)/src"
   ```
   Or set it to the absolute path:
   ```bash
   export ADBREW_CODEBASE_PATH="/path/to/adb_test/src"
   ```

3. **Build the containers**:
   ```bash
   docker-compose build
   ```

4. **Start all services**:
   ```bash
   docker-compose up -d
   ```

5. **Verify containers are running**:
   ```bash
   docker ps
   ```
   You should see three containers: `api`, `app`, and `mongo`

6. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/todos
   - MongoDB: localhost:27017

## API Endpoints

### GET /todos/
Returns all TODO items.

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "description": "Buy groceries"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "description": "Finish homework"
  }
]
```

### POST /todos/
Creates a new TODO item.

**Request Body:**
```json
{
  "description": "New todo item"
}
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "description": "New todo item"
}
```

## Technical Decisions

1. **Separate Dockerfiles**: Better maintainability and optimization for each service
2. **Python 3.8 with pinned dependencies**: Ensures compatibility with all required packages
3. **MongoDB 5.0**: More recent stable version with better performance
4. **React Hooks**: Modern React patterns as per requirements
5. **Direct MongoDB connection**: No ORM, direct PyMongo usage as specified
6. **Optimistic UI updates**: Better user experience by updating UI immediately after POST

## Troubleshooting

### Containers not starting
- Check logs: `docker logs api`, `docker logs app`, `docker logs mongo`
- Verify `ADBREW_CODEBASE_PATH` is set correctly
- Ensure ports 3000, 8000, and 27017 are not in use

### API connection errors
- Verify MongoDB container is running: `docker ps`
- Check environment variables in `docker-compose.yml`
- Check API logs for MongoDB connection errors

### Build errors
- Ensure Docker has enough resources allocated
- Check internet connection for package downloads
- Clear Docker cache if needed: `docker-compose build --no-cache`

## Testing

The application can be tested using:

1. **Browser**: Navigate to http://localhost:3000
2. **cURL**:
   ```bash
   # Get all todos
   curl http://localhost:8000/todos/
   
   # Create a todo
   curl -X POST http://localhost:8000/todos/ \
     -H "Content-Type: application/json" \
     -d '{"description": "Test todo"}'
   ```

## Notes

- The React app uses `localhost:8000` for API calls since it runs in the browser (host machine)
- MongoDB data persists in the `db/` directory via volume mounting
- All containers communicate using Docker's internal networking (service names)

