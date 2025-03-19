import axios from "axios";
import { getAuthToken, setAuthToken } from "../services/auth";
import { useRouter } from "vue-router";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Use base URL from .env
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Automatically attach token if available
api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle expired tokens globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const router = useRouter();
            setAuthToken(null); // Clear token from storage
            router.push("/login"); // Redirect user to login page
        }
        return Promise.reject(error);
    }
);

export default api;
