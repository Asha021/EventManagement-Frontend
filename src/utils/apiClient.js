import axios from "axios";

const API_URL = import.meta.env.MODE === "development" 
    ? "http://localhost:3000/api" 
    : "https://eventmanagement-backend-1-82fc.onrender.com/api";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem("cf_token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

export default api;
