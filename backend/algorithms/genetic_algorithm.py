import time

import numpy as np

from .utils import (
    build_distance_matrix,
    default_rng,
    emit_progress,
    format_history_entry,
    random_route,
    route_distance,
    standardize_result,
)


def tournament_selection(population, distances, rng, tournament_size):
    contender_indices = rng.sample(
        range(len(population)),
        k=min(tournament_size, len(population)),
    )
    winner_index = min(contender_indices, key=lambda index: distances[index])
    return population[winner_index][:]


def ordered_crossover(parent_a, parent_b, rng):
    route_length = len(parent_a)
    if route_length <= 3:
        return parent_a[:]

    start, end = sorted(rng.sample(range(1, route_length), 2))
    child = [None] * route_length
    child[0] = 0
    child[start : end + 1] = parent_a[start : end + 1]

    parent_b_cities = [city for city in parent_b[1:] if city not in child]
    insertion_index = 1

    for city in parent_b_cities:
        while child[insertion_index] is not None:
            insertion_index += 1
        child[insertion_index] = city

    return child


def mutate(route, rng):
    if len(route) <= 3:
        return route

    first_index, second_index = sorted(rng.sample(range(1, len(route)), 2))
    route[first_index], route[second_index] = route[second_index], route[first_index]
    return route


def solve_tsp(cities, parameters=None):
    params = parameters or {}
    city_count = len(cities)
    if city_count < 2:
        raise ValueError("Genetic algorithm requires at least two cities.")

    population_size = max(8, int(params.get("population", 80)))
    generations = max(1, int(params.get("generations", 250)))
    mutation_rate = float(params.get("mutation_rate", 0.12))
    elite_size = max(2, min(population_size // 2, int(params.get("elite_size", 8))))
    tournament_size = max(2, int(params.get("tournament_size", 4)))
    report_interval = max(1, int(params.get("report_interval", max(1, generations // 25))))
    max_history = max(20, int(params.get("max_history", 220)))
    progress_callback = params.get("progress_callback")

    rng = default_rng(params.get("seed"))
    matrix = build_distance_matrix(cities)
    started_at = time.perf_counter()
    history = []

    population = [random_route(city_count, rng) for _ in range(population_size)]
    best_route = population[0][:]
    best_distance = route_distance(best_route, matrix)

    for generation in range(generations):
        distances = np.array([route_distance(route, matrix) for route in population], dtype=float)
        ranking = np.argsort(distances)
        population = [population[index] for index in ranking]
        distances = distances[ranking]

        generation_best_distance = float(distances[0])
        generation_best_route = population[0][:]
        improved = generation_best_distance < best_distance

        if improved:
            best_distance = generation_best_distance
            best_route = generation_best_route[:]

        should_snapshot = generation == 0 or generation == generations - 1 or generation % report_interval == 0
        if len(history) < max_history and (improved or should_snapshot):
            event = format_history_entry(
                len(history),
                generation_best_route,
                generation_best_distance,
                cities,
                close_loop=True,
                stage="improved" if improved else "generation",
                generation=generation,
                population=population_size,
            )
            history.append(event)
            emit_progress(progress_callback, event)

        next_population = [route[:] for route in population[:elite_size]]

        while len(next_population) < population_size:
            parent_a = tournament_selection(population, distances.tolist(), rng, tournament_size)
            parent_b = tournament_selection(population, distances.tolist(), rng, tournament_size)
            child = ordered_crossover(parent_a, parent_b, rng)

            if rng.random() < mutation_rate:
                child = mutate(child, rng)

            next_population.append(child)

        population = next_population

    final_event = format_history_entry(
        len(history),
        best_route,
        best_distance,
        cities,
        close_loop=True,
        stage="completed",
        generation=generations,
        population=population_size,
    )
    history.append(final_event)
    emit_progress(progress_callback, final_event)

    return standardize_result(
        best_route,
        cities,
        matrix,
        history,
        started_at,
        meta={
            "population": population_size,
            "generations": generations,
            "mutation_rate": mutation_rate,
        },
    )
