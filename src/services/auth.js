// src/services/auth.js
import api from "../services/api";

export function getAuthToken() {
    return localStorage.getItem("token");
}

export function setAuthToken(token) {
    if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
    }
}
