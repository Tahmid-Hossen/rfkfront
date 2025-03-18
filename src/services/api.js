import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Use the base URL from .env
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Automatically attach token if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
