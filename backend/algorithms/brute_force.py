import itertools
import time

from .utils import build_distance_matrix, emit_progress, format_history_entry, standardize_result, route_distance


def solve_tsp(cities, parameters=None):
    params = parameters or {}
    city_count = len(cities)
    if city_count < 2:
        raise ValueError("Brute force requires at least two cities.")

    max_cities = max(2, int(params.get("max_cities", 9)))
    progress_interval = max(1, int(params.get("progress_interval", 25)))
    max_history = max(10, int(params.get("max_history", 180)))
    progress_callback = params.get("progress_callback")

    if city_count > max_cities:
        raise ValueError(
            f"Brute force is limited to {max_cities} cities to keep execution practical."
        )

    matrix = build_distance_matrix(cities)
    started_at = time.perf_counter()
    history = []

    best_route = [0, *range(1, city_count)]
    best_distance = float("inf")
    evaluated_routes = 0

    for permutation in itertools.permutations(range(1, city_count)):
        route = [0, *permutation]
        candidate_distance = route_distance(route, matrix)
        evaluated_routes += 1

        should_snapshot = evaluated_routes % progress_interval == 0
        improved = candidate_distance < best_distance

        if improved:
            best_route = route
            best_distance = candidate_distance

        if len(history) < max_history and (improved or should_snapshot):
            stage = "improved" if improved else "searching"
            event = format_history_entry(
                len(history),
                route if not improved else best_route,
                candidate_distance if not improved else best_distance,
                cities,
                close_loop=True,
                stage=stage,
                permutations_evaluated=evaluated_routes,
            )
            history.append(event)
            emit_progress(progress_callback, event)

    final_event = format_history_entry(
        len(history),
        best_route,
        best_distance,
        cities,
        close_loop=True,
        stage="completed",
        permutations_evaluated=evaluated_routes,
    )
    history.append(final_event)
    emit_progress(progress_callback, final_event)

    return standardize_result(
        best_route,
        cities,
        matrix,
        history,
        started_at,
        meta={"evaluated_routes": evaluated_routes},
    )
