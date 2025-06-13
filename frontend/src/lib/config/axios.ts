import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(async (config) => {
    try {
        const token =  localStorage.getItem("AUTH_TOKEN");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    } catch (error) {
        console.error("Error al obtener el token:", error);
        return Promise.reject(error);
    }
});

export default api;
