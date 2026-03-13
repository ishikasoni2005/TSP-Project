import math
import time

from .utils import (
    build_distance_matrix,
    default_rng,
    emit_progress,
    format_history_entry,
    nearest_neighbor_route,
    random_route,
    route_distance,
    standardize_result,
)


def make_neighbour(route, rng, strategy="2opt"):
    candidate = route[:]
    if len(candidate) <= 3:
        return candidate

    first_index, second_index = sorted(rng.sample(range(1, len(candidate)), 2))

    if strategy == "swap":
        candidate[first_index], candidate[second_index] = (
            candidate[second_index],
            candidate[first_index],
        )
    else:
        candidate[first_index : second_index + 1] = list(
            reversed(candidate[first_index : second_index + 1])
        )

    return candidate


def solve_tsp(cities, parameters=None):
    params = parameters or {}
    city_count = len(cities)
    if city_count < 2:
        raise ValueError("Simulated annealing requires at least two cities.")

    initial_temperature = max(0.1, float(params.get("initial_temperature", 900.0)))
    final_temperature = max(0.001, float(params.get("final_temperature", 1.0)))
    cooling_rate = min(0.9999, max(0.8, float(params.get("cooling_rate", 0.985))))
    iterations_per_temp = max(1, int(params.get("iterations_per_temp", 12)))
    report_interval = max(1, int(params.get("report_interval", 15)))
    max_history = max(20, int(params.get("max_history", 220)))
    strategy = params.get("neighbor_strategy", "2opt")
    progress_callback = params.get("progress_callback")

    rng = default_rng(params.get("seed"))
    matrix = build_distance_matrix(cities)
    started_at = time.perf_counter()
    history = []

    current_route = (
        random_route(city_count, rng)
        if params.get("random_start", False)
        else nearest_neighbor_route(matrix)
    )
    current_distance = route_distance(current_route, matrix)
    best_route = current_route[:]
    best_distance = current_distance
    temperature = initial_temperature
    iteration = 0

    initial_event = format_history_entry(
        len(history),
        current_route,
        current_distance,
        cities,
        close_loop=True,
        stage="seed",
        temperature=round(temperature, 4),
        iteration=iteration,
    )
    history.append(initial_event)
    emit_progress(progress_callback, initial_event)

    while temperature > final_temperature:
        for _ in range(iterations_per_temp):
            candidate_route = make_neighbour(current_route, rng, strategy=strategy)
            candidate_distance = route_distance(candidate_route, matrix)
            delta = candidate_distance - current_distance
            accepted = delta < 0 or rng.random() < math.exp(-delta / max(temperature, 1e-9))
            improved = False

            if accepted:
                current_route = candidate_route
                current_distance = candidate_distance

                if current_distance < best_distance:
                    best_distance = current_distance
                    best_route = current_route[:]
                    improved = True

            should_snapshot = iteration % report_interval == 0
            if len(history) < max_history and (improved or should_snapshot):
                event = format_history_entry(
                    len(history),
                    best_route if improved else current_route,
                    best_distance if improved else current_distance,
                    cities,
                    close_loop=True,
                    stage="improved" if improved else "searching",
                    temperature=round(temperature, 4),
                    accepted=accepted,
                    iteration=iteration,
                )
                history.append(event)
                emit_progress(progress_callback, event)

            iteration += 1

        temperature *= cooling_rate

    final_event = format_history_entry(
        len(history),
        best_route,
        best_distance,
        cities,
        close_loop=True,
        stage="completed",
        temperature=round(temperature, 4),
        iteration=iteration,
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
            "iterations": iteration,
            "initial_temperature": initial_temperature,
            "final_temperature": final_temperature,
            "cooling_rate": cooling_rate,
        },
    )
