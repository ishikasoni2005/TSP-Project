# 🚀 Advanced Travelling Salesman Problem (TSP) Visual Solver

An **interactive algorithm visualization platform** that demonstrates how different optimization algorithms solve the **Travelling Salesman Problem (TSP)**.

This project combines **algorithmic problem solving with visual learning**, allowing users to explore how various approaches compute optimal routes through step-by-step visualizations.

Designed to make complex algorithms **intuitive, interactive, and educational**.

---

# 🧩 What is the Travelling Salesman Problem?

The **Travelling Salesman Problem (TSP)** is a classic optimization problem in computer science.

## Problem Statement

Given a list of cities and the distance between each pair:

- Visit every city **exactly once**
- Return to the **starting city**
- Minimize the **total travel distance**

The difficulty increases **factorially** as the number of cities grows, making it one of the most studied **NP-hard problems** in algorithm design and optimization.

This project demonstrates how different algorithms approach solving this problem and compares their behavior visually.

---

# ✨ Key Features

## 🔍 Multiple Algorithm Implementations

The solver includes several well-known approaches for solving TSP:

### 1️⃣ Brute Force
- Examines **all possible permutations**
- Guarantees the **optimal solution**
- Computationally expensive for large inputs

### 2️⃣ Dynamic Programming (Held–Karp)
- Uses **optimal substructure**
- Reduces redundant calculations
- Faster than brute force for moderate inputs

### 3️⃣ Genetic Algorithm
- Inspired by **natural selection**
- Evolves candidate solutions over generations
- Effective for larger datasets

### 4️⃣ Simulated Annealing
- Uses **probabilistic optimization**
- Escapes local minima
- Produces near-optimal routes efficiently

---

# 🗺️ Visualization Modes

## 🌍 Real-World Map Visualization
Powered by **Leaflet.js**

Features:
- Plot cities on an interactive map
- Display computed routes geographically
- Explore spatial relationships

## 🎨 Canvas Visualization
Built using **HTML5 Canvas**

Features:
- Abstract node-edge visualization
- Algorithm animations
- Step-by-step route construction

---

# 📊 Interactive Features

### 📥 Dataset Handling
- Import city datasets using **JSON**
- Export datasets for reuse

### ⚙️ Algorithm Controls
- Select algorithm
- Adjust parameters
- Start / pause / reset execution

### 🎬 Real-Time Visualization
- Watch algorithms build routes step-by-step
- Observe optimization progress

### 📈 Performance Insights
- Compare algorithm performance
- Visualize metrics using **Chart.js**

---

# 🛠️ Tech Stack

## Frontend
- **HTML5** — Semantic markup
- **CSS3** — Responsive styling
- **JavaScript** — Application logic
- **Leaflet.js** — Interactive maps
- **Chart.js** — Performance visualization
- **HTML5 Canvas** — Algorithm animation

---

# 👩‍💻 My Contributions

This project was **fully designed and developed by me**, focusing on creating an intuitive and visually engaging environment for exploring algorithm behavior.

### UI/UX Design
- Designed the **overall interface layout**
- Created a **clean and modern visual design**
- Implemented **responsive layout**

### Frontend Development
- Built **interactive UI components**
- Implemented **algorithm control interface**
- Developed **dataset import/export functionality**

### Visualization System
- Implemented **algorithm animations using Canvas**
- Integrated **Leaflet.js for map visualization**
- Built **performance charts using Chart.js**

### Interaction & Data Flow
- Implemented JavaScript logic for:
  - user interactions
  - algorithm execution
  - visualization updates
  - performance tracking

---

# 📁 Project Structure

TSP-Visual-Solver
│
├── index.html
├── styles.css
├── app.js
│
├── algorithms/
│ ├── brute_force.js
│ ├── dynamic_programming.js
│ ├── genetic_algorithm.js
│ └── simulated_annealing.js
│
├── visualization/
│ ├── canvas_visualizer.js
│ └── map_visualizer.js
│
└── datasets/
└── sample_cities.json


---

# 🚀 Getting Started

## 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/tsp-visual-solver.git

2️⃣ Navigate into the project
cd tsp-visual-solver
3️⃣ Open the application
Open the following file in your browser:
index.html
📚 Educational Value
This project helps in understanding:
Algorithm design
Optimization techniques
NP-hard problems
Exact vs heuristic algorithms
It bridges the gap between algorithm theory and visual learning.
🔮 Future Improvements
Add Ant Colony Optimization
Add 3D route visualization
Add large dataset benchmarking
Convert into React + Django full-stack architecture
Implement real-time collaborative visualization


