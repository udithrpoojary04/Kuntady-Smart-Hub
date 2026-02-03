import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: 30000, // 30 seconds timeout
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If timeout or network error, retry logic could go here
        // For now, we just log it clearly
        if (error.code === 'ECONNABORTED' || error.response?.status === 504) {
            console.error("Timeout/Network Error - Backend might be sleeping");
        }
        return Promise.reject(error);
    }
);

export default api;
