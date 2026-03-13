import { createContext, useContext, useEffect, useState } from "react";

import { solverApi } from "../services/api";
import {
  createCity,
  demoCities,
  downloadDataset,
  parseDatasetPayload,
} from "../utils/tsp";


const STORAGE_KEYS = {
  theme: "tsp-theme",
  workspaceCities: "tsp-workspace-cities",
  workspaceDataset: "tsp-workspace-dataset",
};

const TspContext = createContext(null);


function readStoredJson(key, fallback) {
  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch (error) {
    console.error(`Unable to parse local storage key ${key}`, error);
    return fallback;
  }
}


export function TspProvider({ children }) {
  const [theme, setTheme] = useState(() => window.localStorage.getItem(STORAGE_KEYS.theme) || "dark");
  const [cities, setCities] = useState(() => readStoredJson(STORAGE_KEYS.workspaceCities, demoCities));
  const [activeDataset, setActiveDataset] = useState(() =>
    readStoredJson(STORAGE_KEYS.workspaceDataset, {
      name: "Demo Indian Cities",
      description: "Starter dataset loaded from local state.",
    }),
  );
  const [datasets, setDatasets] = useState([]);
  const [datasetsLoading, setDatasetsLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [visualMode, setVisualMode] = useState("map");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.workspaceCities, JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.workspaceDataset, JSON.stringify(activeDataset));
  }, [activeDataset]);

  async function refreshDatasets() {
    setDatasetsLoading(true);
    try {
      const response = await solverApi.getDatasets();
      setDatasets(response);
      return response;
    } catch (error) {
      console.error("Failed to load datasets", error);
      return [];
    } finally {
      setDatasetsLoading(false);
    }
  }

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }

  function addCity(lat, lng, name) {
    setCities((currentCities) => [...currentCities, createCity(lat, lng, currentCities.length, name)]);
  }

  function updateCity(index, patch) {
    setCities((currentCities) =>
      currentCities.map((city, cityIndex) =>
        cityIndex === index ? { ...city, ...patch } : city,
      ),
    );
  }

  function removeCity(index) {
    setCities((currentCities) => currentCities.filter((_, cityIndex) => cityIndex !== index));
  }

  function importCities(payload) {
    const parsed = parseDatasetPayload(payload);
    setCities(parsed.cities);
    setActiveDataset({
      name: parsed.name || "Imported Dataset",
      description: parsed.description || "Imported from JSON file",
    });
    return parsed;
  }

  function loadDataset(dataset) {
    setCities(dataset.cities || []);
    setActiveDataset({
      id: dataset.id,
      name: dataset.name,
      description: dataset.description,
    });
  }

  function exportCities(name) {
    return downloadDataset(name || activeDataset?.name || "tsp-dataset", cities);
  }

  function resetWorkspace() {
    setCities(demoCities);
    setActiveDataset({
      name: "Demo Indian Cities",
      description: "Starter dataset loaded from local state.",
    });
    setLastResult(null);
    setComparisonResults([]);
  }

  return (
    <TspContext.Provider
      value={{
        activeDataset,
        addCity,
        cities,
        comparisonResults,
        datasets,
        datasetsLoading,
        exportCities,
        importCities,
        lastResult,
        loadDataset,
        refreshDatasets,
        removeCity,
        resetWorkspace,
        setActiveDataset,
        setCities,
        setComparisonResults,
        setLastResult,
        setVisualMode,
        theme,
        toggleTheme,
        updateCity,
        visualMode,
      }}
    >
      {children}
    </TspContext.Provider>
  );
}


export function useTsp() {
  const context = useContext(TspContext);

  if (!context) {
    throw new Error("useTsp must be used inside a TspProvider.");
  }

  return context;
}
