import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://eventmanagement-backend-1-82fc.onrender.com/api";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

export default api;
