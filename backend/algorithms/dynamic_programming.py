import itertools
import time

from .utils import build_distance_matrix, emit_progress, format_history_entry, standardize_result


def reconstruct_path(parent, mask, last_city):
    route = [last_city]
    current_mask = mask
    current_city = last_city

    while current_city != 0:
        previous_city = parent[(current_mask, current_city)]
        route.append(previous_city)
        current_mask ^= 1 << current_city
        current_city = previous_city

    return list(reversed(route))


def solve_tsp(cities, parameters=None):
    params = parameters or {}
    city_count = len(cities)
    if city_count < 2:
        raise ValueError("Dynamic programming requires at least two cities.")

    max_cities = max(2, int(params.get("max_cities", 15)))
    max_history = max(10, int(params.get("max_history", 120)))
    progress_callback = params.get("progress_callback")

    if city_count > max_cities:
        raise ValueError(
            f"Held-Karp is limited to {max_cities} cities to avoid excessive memory use."
        )

    matrix = build_distance_matrix(cities)
    started_at = time.perf_counter()

    dp = {}
    parent = {}
    history = []
    state_transitions = 0
    full_mask = (1 << city_count) - 1

    for city in range(1, city_count):
        mask = 1 | (1 << city)
        dp[(mask, city)] = matrix[0][city]
        parent[(mask, city)] = 0

    if city_count > 1:
        nearest_city = min(range(1, city_count), key=lambda city: matrix[0][city])
        seed_event = format_history_entry(
            len(history),
            [0, nearest_city],
            matrix[0][nearest_city],
            cities,
            close_loop=False,
            stage="seed",
            subset_size=2,
        )
        history.append(seed_event)
        emit_progress(progress_callback, seed_event)

    for subset_size in range(3, city_count + 1):
        level_best_cost = float("inf")
        level_best_mask = None
        level_best_last = None

        for subset in itertools.combinations(range(1, city_count), subset_size - 1):
            mask = 1
            for city in subset:
                mask |= 1 << city

            for last_city in subset:
                previous_mask = mask ^ (1 << last_city)
                best_cost = float("inf")
                best_previous_city = None

                for previous_city in subset:
                    if previous_city == last_city:
                        continue

                    candidate_cost = dp[(previous_mask, previous_city)] + matrix[previous_city][last_city]
                    state_transitions += 1

                    if candidate_cost < best_cost:
                        best_cost = candidate_cost
                        best_previous_city = previous_city

                dp[(mask, last_city)] = best_cost
                parent[(mask, last_city)] = best_previous_city

                if best_cost < level_best_cost:
                    level_best_cost = best_cost
                    level_best_mask = mask
                    level_best_last = last_city

        if level_best_mask is not None and len(history) < max_history:
            partial_route = reconstruct_path(parent, level_best_mask, level_best_last)
            event = format_history_entry(
                len(history),
                partial_route,
                level_best_cost,
                cities,
                close_loop=False,
                stage="subset_complete",
                subset_size=subset_size,
                states_evaluated=state_transitions,
            )
            history.append(event)
            emit_progress(progress_callback, event)

    best_distance = float("inf")
    best_last_city = None

    for last_city in range(1, city_count):
        candidate_distance = dp[(full_mask, last_city)] + matrix[last_city][0]
        state_transitions += 1

        if candidate_distance < best_distance:
            best_distance = candidate_distance
            best_last_city = last_city

    best_route = reconstruct_path(parent, full_mask, best_last_city)

    final_event = format_history_entry(
        len(history),
        best_route,
        best_distance,
        cities,
        close_loop=True,
        stage="completed",
        states_evaluated=state_transitions,
    )
    history.append(final_event)
    emit_progress(progress_callback, final_event)

    return standardize_result(
        best_route,
        cities,
        matrix,
        history,
        started_at,
        meta={"states_evaluated": state_transitions},
    )
