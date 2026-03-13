export const demoCities = [
  { name: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
];

export const ALGORITHM_OPTIONS = [
  {
    value: "brute_force",
    label: "Brute Force",
    complexity: "O(n!)",
    description: "Exhaustive exact search for small datasets.",
  },
  {
    value: "dynamic_programming",
    label: "Dynamic Programming",
    complexity: "O(n^2 * 2^n)",
    description: "Held-Karp exact solver for medium datasets.",
  },
  {
    value: "genetic",
    label: "Genetic Algorithm",
    complexity: "Heuristic",
    description: "Population-based search with crossover and mutation.",
  },
  {
    value: "simulated_annealing",
    label: "Simulated Annealing",
    complexity: "Heuristic",
    description: "Probabilistic neighborhood search with cooling schedule.",
  },
];

export const DEFAULT_PARAMETERS = {
  brute_force: {
    max_cities: 9,
    progress_interval: 25,
  },
  dynamic_programming: {
    max_cities: 15,
  },
  genetic: {
    population: 80,
    generations: 250,
    mutation_rate: 0.12,
    elite_size: 8,
  },
  simulated_annealing: {
    initial_temperature: 900,
    final_temperature: 1,
    cooling_rate: 0.985,
    iterations_per_temp: 12,
  },
};

export const PARAMETER_FIELDS = {
  brute_force: [
    { key: "max_cities", label: "Max Cities", type: "number", min: 2, max: 10, step: 1 },
    { key: "progress_interval", label: "Snapshot Every", type: "number", min: 1, step: 1 },
  ],
  dynamic_programming: [
    { key: "max_cities", label: "Max Cities", type: "number", min: 2, max: 18, step: 1 },
  ],
  genetic: [
    { key: "population", label: "Population", type: "number", min: 8, step: 1 },
    { key: "generations", label: "Generations", type: "number", min: 1, step: 1 },
    { key: "mutation_rate", label: "Mutation Rate", type: "number", min: 0.01, max: 1, step: 0.01 },
    { key: "elite_size", label: "Elite Size", type: "number", min: 2, step: 1 },
  ],
  simulated_annealing: [
    { key: "initial_temperature", label: "Initial Temp", type: "number", min: 1, step: 1 },
    { key: "final_temperature", label: "Final Temp", type: "number", min: 0.01, step: 0.01 },
    { key: "cooling_rate", label: "Cooling Rate", type: "number", min: 0.8, max: 0.9999, step: 0.0001 },
    { key: "iterations_per_temp", label: "Iterations / Temp", type: "number", min: 1, step: 1 },
  ],
};


export function getDefaultParameters(algorithm) {
  return JSON.parse(JSON.stringify(DEFAULT_PARAMETERS[algorithm] || {}));
}


export function createCity(lat, lng, index, name) {
  const roundedLat = Number.parseFloat(Number(lat).toFixed(4));
  const roundedLng = Number.parseFloat(Number(lng).toFixed(4));
  return {
    name: name || `City ${index + 1}`,
    lat: roundedLat,
    lng: roundedLng,
  };
}


export function parseDatasetPayload(payload) {
  const rawCities = Array.isArray(payload) ? payload : payload?.cities;
  if (!Array.isArray(rawCities) || rawCities.length < 2) {
    throw new Error("Dataset must contain a 'cities' array with at least two entries.");
  }

  const normalizedCities = rawCities.map((city, index) => {
    const lat = Number(city.lat);
    const lng = Number(city.lng);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      throw new Error(`City at position ${index + 1} is missing numeric coordinates.`);
    }

    return createCity(lat, lng, index, city.name || `City ${index + 1}`);
  });

  return {
    name: payload?.name || "Imported Dataset",
    description: payload?.description || "",
    cities: normalizedCities,
  };
}


export function downloadDataset(name, cities) {
  const payload = {
    name,
    description: "Exported from Advanced TSP Visual Solver.",
    cities,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });

  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = `${name.toLowerCase().replace(/\s+/g, "-") || "tsp-dataset"}.json`;
  link.click();
  URL.revokeObjectURL(objectUrl);
}


export function formatDistance(distance) {
  if (distance === null || distance === undefined) {
    return "Not available";
  }
  return `${Number(distance).toFixed(2)} km`;
}


export function formatDuration(timeMs) {
  if (timeMs === null || timeMs === undefined) {
    return "Not available";
  }
  return `${Number(timeMs).toFixed(2)} ms`;
}


export function formatDateTime(dateString) {
  if (!dateString) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}


export function projectCitiesToCanvas(cities, width, height, padding = 56) {
  if (!cities.length) {
    return {
      bounds: {
        height,
        latSpan: 28,
        lngSpan: 29,
        maxLat: 36,
        minLat: 8,
        minLng: 68,
        padding,
        width,
      },
      points: [],
    };
  }

  const latitudes = cities.map((city) => city.lat);
  const longitudes = cities.map((city) => city.lng);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const latSpan = Math.max(maxLat - minLat, 8);
  const lngSpan = Math.max(maxLng - minLng, 8);

  const points = cities.map((city) => ({
    x: padding + ((city.lng - minLng) / lngSpan) * (width - padding * 2),
    y: height - padding - ((city.lat - minLat) / latSpan) * (height - padding * 2),
  }));

  return {
    bounds: {
      height,
      latSpan,
      lngSpan,
      maxLat,
      minLat,
      minLng,
      padding,
      width,
    },
    points,
  };
}


export function canvasPointToGeo(x, y, bounds) {
  if (!bounds) {
    return null;
  }

  const safeWidth = Math.max(bounds.width - bounds.padding * 2, 1);
  const safeHeight = Math.max(bounds.height - bounds.padding * 2, 1);

  const lng = bounds.minLng + ((x - bounds.padding) / safeWidth) * bounds.lngSpan;
  const lat =
    bounds.minLat +
    ((bounds.height - bounds.padding - y) / safeHeight) * bounds.latSpan;

  return { lat, lng };
}


export function extractApiError(error) {
  const responseData = error?.response?.data;

  if (typeof responseData === "string") {
    return responseData;
  }

  if (responseData?.detail) {
    return Array.isArray(responseData.detail) ? responseData.detail[0] : responseData.detail;
  }

  if (responseData && typeof responseData === "object") {
    const firstField = Object.values(responseData)[0];
    if (Array.isArray(firstField) && firstField.length) {
      return firstField[0];
    }
  }

  return error?.message || "The request failed.";
}


export function generateSessionId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  }

  return Math.random().toString(36).slice(2, 18);
}
