from __future__ import annotations

import math
import random
import time


EARTH_RADIUS_KM = 6371.0


def haversine_distance(lat1, lng1, lat2, lng2):
    lat1_rad = math.radians(lat1)
    lng1_rad = math.radians(lng1)
    lat2_rad = math.radians(lat2)
    lng2_rad = math.radians(lng2)

    delta_lat = lat2_rad - lat1_rad
    delta_lng = lng2_rad - lng1_rad

    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lng / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return EARTH_RADIUS_KM * c


def build_distance_matrix(cities):
    city_count = len(cities)
    matrix = [[0.0 for _ in range(city_count)] for _ in range(city_count)]

    for origin_index, origin in enumerate(cities):
        for destination_index in range(origin_index + 1, city_count):
            destination = cities[destination_index]
            distance = haversine_distance(
                origin["lat"],
                origin["lng"],
                destination["lat"],
                destination["lng"],
            )
            matrix[origin_index][destination_index] = distance
            matrix[destination_index][origin_index] = distance

    return matrix


def close_route(route_indices):
    route = list(route_indices)
    if not route:
        return []
    if route[0] != route[-1]:
        route.append(route[0])
    return route


def route_distance(route_indices, matrix):
    route = list(route_indices)
    if len(route) < 2:
        return 0.0

    distance = 0.0
    for current_city, next_city in zip(route, route[1:]):
        distance += matrix[current_city][next_city]
    distance += matrix[route[-1]][route[0]]
    return distance


def route_to_names(route_indices, cities, close_loop=True):
    route = close_route(route_indices) if close_loop else list(route_indices)
    return [cities[index]["name"] for index in route]


def format_history_entry(step, route_indices, distance, cities, close_loop=False, **extra):
    resolved_route = close_route(route_indices) if close_loop else list(route_indices)
    payload = {
        "step": step,
        "route_indices": resolved_route,
        "route": route_to_names(route_indices, cities, close_loop=close_loop),
        "distance": round(float(distance), 3),
        "closed": close_loop,
    }
    payload.update({key: value for key, value in extra.items() if value is not None})
    return payload


def emit_progress(progress_callback, payload):
    if callable(progress_callback):
        progress_callback(payload)


def elapsed_ms(started_at):
    return round((time.perf_counter() - started_at) * 1000, 3)


def standardize_result(route_indices, cities, matrix, history, started_at, meta=None):
    route = list(route_indices)
    result = {
        "route_indices": close_route(route),
        "route": route_to_names(route, cities, close_loop=True),
        "distance": round(route_distance(route, matrix), 3),
        "time_ms": elapsed_ms(started_at),
        "history": history,
    }
    if meta:
        result["meta"] = meta
    return result


def default_rng(seed=None):
    return random.Random(seed)


def random_route(city_count, rng, start=0):
    remaining = [index for index in range(city_count) if index != start]
    rng.shuffle(remaining)
    return [start, *remaining]


def nearest_neighbor_route(matrix, start=0):
    if not matrix:
        return []

    remaining = set(range(len(matrix)))
    remaining.remove(start)
    route = [start]

    while remaining:
        next_city = min(remaining, key=lambda city: matrix[route[-1]][city])
        route.append(next_city)
        remaining.remove(next_city)

    return route
