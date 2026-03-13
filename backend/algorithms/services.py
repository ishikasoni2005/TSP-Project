from . import brute_force, dynamic_programming, genetic_algorithm, simulated_annealing


ALGORITHM_REGISTRY = {
    "brute_force": {
        "label": "Brute Force",
        "description": "Tries every possible route to guarantee the optimal answer.",
        "complexity": "O(n!)",
        "default_parameters": {
            "progress_interval": 25,
            "max_cities": 9,
        },
        "solver": brute_force.solve_tsp,
    },
    "dynamic_programming": {
        "label": "Dynamic Programming (Held-Karp)",
        "description": "Exact bitmask dynamic programming for medium-sized datasets.",
        "complexity": "O(n^2 * 2^n)",
        "default_parameters": {
            "max_cities": 15,
        },
        "solver": dynamic_programming.solve_tsp,
    },
    "genetic": {
        "label": "Genetic Algorithm",
        "description": "Evolves a population of routes with crossover and mutation.",
        "complexity": "Heuristic",
        "default_parameters": {
            "population": 80,
            "generations": 250,
            "mutation_rate": 0.12,
        },
        "solver": genetic_algorithm.solve_tsp,
    },
    "simulated_annealing": {
        "label": "Simulated Annealing",
        "description": "Explores neighbours probabilistically to escape local minima.",
        "complexity": "Heuristic",
        "default_parameters": {
            "initial_temperature": 900.0,
            "final_temperature": 1.0,
            "cooling_rate": 0.985,
        },
        "solver": simulated_annealing.solve_tsp,
    },
}

ALGORITHM_ALIASES = {
    "bruteforce": "brute_force",
    "brute": "brute_force",
    "dp": "dynamic_programming",
    "held_karp": "dynamic_programming",
    "held-karp": "dynamic_programming",
    "genetic_algorithm": "genetic",
    "annealing": "simulated_annealing",
    "simulatedannealing": "simulated_annealing",
}


def normalize_algorithm_name(name):
    slug = name.strip().lower().replace("-", "_").replace(" ", "_")
    slug = ALGORITHM_ALIASES.get(slug, slug)

    if slug not in ALGORITHM_REGISTRY:
        supported = ", ".join(sorted(ALGORITHM_REGISTRY.keys()))
        raise ValueError(f"Unsupported algorithm '{name}'. Choose one of: {supported}.")

    return slug


def get_algorithm_catalog():
    catalog = []
    for identifier, config in ALGORITHM_REGISTRY.items():
        catalog.append(
            {
                "id": identifier,
                "label": config["label"],
                "description": config["description"],
                "complexity": config["complexity"],
                "default_parameters": config["default_parameters"],
            }
        )
    return catalog


def solve_algorithm(algorithm, cities, parameters=None):
    normalized_algorithm = normalize_algorithm_name(algorithm)
    solver = ALGORITHM_REGISTRY[normalized_algorithm]["solver"]
    return solver(cities, parameters or {})
