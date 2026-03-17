# Advanced Travelling Salesman Problem Visual Solver

A full-stack TSP playground built with React, Vite, TailwindCSS, Django REST Framework, and Django Channels.

This project upgrades the original single-file HTML/JS prototype into a scalable architecture with:
- React-based visualization and dataset management
- Django APIs for persistence and solving
- WebSocket progress streaming for live route updates
- Four TSP algorithms with replayable iteration history
- Leaflet map mode, canvas mode, dark mode, and performance comparison charts

## Features

- Add cities manually by clicking on the map or canvas
- Import and export city datasets as JSON
- Save datasets to the backend and reload them later
- Solve TSP with:
  - Brute Force
  - Dynamic Programming (Held-Karp)
  - Genetic Algorithm
  - Simulated Annealing
- Replay route construction step by step
- Compare algorithm distance and runtime in charts
- Responsive UI for desktop, tablet, and mobile

## Tech Stack

### Frontend

- React.js with Vite
- TailwindCSS
- React Router
- Axios
- Leaflet + React Leaflet
- Chart.js + react-chartjs-2

### Backend

- Django
- Django REST Framework
- Django Channels
- NumPy
- SQLite for dataset storage

## Project Structure

```text
.
├── backend
│   ├── algorithms
│   │   ├── brute_force.py
│   │   ├── dynamic_programming.py
│   │   ├── genetic_algorithm.py
│   │   ├── simulated_annealing.py
│   │   ├── services.py
│   │   ├── serializers.py
│   │   └── views.py
│   ├── tsp
│   ├── tsp_solver_backend
│   ├── visualization
│   ├── manage.py
│   └── requirements.txt
└── frontend
    └── tsp_solver_frontend
        ├── src
        │   ├── components
        │   ├── context
        │   ├── hooks
        │   ├── layouts
        │   ├── pages
        │   ├── services
        │   └── utils
        ├── package.json
        ├── tailwind.config.js
        └── vite.config.js
```

## Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs by default at `http://127.0.0.1:8000`.

## Frontend Setup

```bash
cd frontend/tsp_solver_frontend
npm install
npm run dev
```

Frontend runs by default at `http://127.0.0.1:5173`.

Create local env files from:

- `backend/.env.example`
- `frontend/tsp_solver_frontend/.env.example`

## API Endpoints

### Datasets

- `GET /api/cities/`
- `POST /api/cities/`

Example request:

```json
{
  "name": "Indian Metro Sample",
  "description": "Demo coordinates for solver experiments",
  "cities": [
    { "name": "Delhi", "lat": 28.6139, "lng": 77.2090 },
    { "name": "Mumbai", "lat": 19.0760, "lng": 72.8777 }
  ]
}
```

### Solve

- `POST /api/solve/`

Example request:

```json
{
  "algorithm": "genetic",
  "cities": [
    { "name": "A", "lat": 28.61, "lng": 77.23 },
    { "name": "B", "lat": 19.07, "lng": 72.87 }
  ],
  "parameters": {
    "population": 100,
    "generations": 500
  },
  "session_id": "solverdemo001"
}
```

Example response:

```json
{
  "algorithm": "genetic",
  "route": ["A", "B", "A"],
  "route_indices": [0, 1, 0],
  "distance": 2305.44,
  "time_ms": 18.12,
  "history": []
}
```

## WebSocket Progress Stream

Open a socket before calling `/api/solve/`:

```text
ws://127.0.0.1:8000/ws/visualization/<session_id>/
```

Progress messages include:

- `connected`
- `status`
- `progress`
- `complete`
- `error`

## Screenshots

Add screenshots here after running the app:

- `docs/screenshots/home.png`
- `docs/screenshots/visualizer-map.png`
- `docs/screenshots/visualizer-canvas.png`
- `docs/screenshots/dataset-manager.png`
- `docs/screenshots/comparison.png`

## Future Improvements

- Redis-backed channel layer for multi-instance production deployment
- Background task queue for long-running solver jobs
- More dataset formats such as CSV and TSPLIB
- Solver presets and saved parameter profiles
- Authentication and shared team workspaces
