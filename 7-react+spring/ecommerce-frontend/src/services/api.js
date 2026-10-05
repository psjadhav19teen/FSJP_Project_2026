import axios from "axios";

const API = axios.create({
  // Vite proxies /api to the Spring Boot server and removes the /api prefix.
  baseURL: "/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

export default API;
