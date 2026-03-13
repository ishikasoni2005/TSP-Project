import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export const solverApi = {
  getAlgorithms: async () => {
    const response = await api.get("/algorithms/");
    return response.data.algorithms || [];
  },
  getDatasets: async () => {
    const response = await api.get("/cities/");
    return response.data;
  },
  getHealth: async () => {
    const response = await api.get("/health/");
    return response.data;
  },
  saveDataset: async (payload) => {
    const response = await api.post("/cities/", payload);
    return response.data;
  },
  solve: async (payload) => {
    const response = await api.post("/solve/", payload);
    return response.data;
  },
};


export function createWebSocketUrl(sessionId) {
  const socketBaseUrl = import.meta.env.VITE_WS_BASE_URL;
  if (socketBaseUrl) {
    return `${socketBaseUrl.replace(/\/$/, "")}/${sessionId}/`;
  }

  const parsedApiUrl = new URL(API_BASE_URL);
  const protocol = parsedApiUrl.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${parsedApiUrl.host}/ws/visualization/${sessionId}/`;
}


export default api;
