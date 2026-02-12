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

        // Validation for retryable errors
        // 1. Network errors (code starts with 'ERR_' or is undefined in some cases)
        // 2. Transformed timeouts (code 'ECONNABORTED')
        // 3. Server errors that might be temporary (500, 502, 503, 504)
        const isRetryable = error.code === 'ECONNABORTED' ||
            !error.response || // Network error often has no response
            (error.response && [500, 502, 503, 504].includes(error.response.status));

        if (isRetryable && !originalRequest._retry) {
            originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

            // Limit retries to 3
            if (originalRequest._retryCount <= 3) {
                console.log(`Attempt ${originalRequest._retryCount} failed. Retrying in ${originalRequest._retryCount * 1000}ms...`);

                // Exponential backoff: 1s, 2s, 3s
                const delay = originalRequest._retryCount * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));

                return api(originalRequest);
            }
        }

        if (error.response?.status === 401 && !originalRequest._retryAuth) {
            originalRequest._retryAuth = true;
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');

            // Remove Authorization header from the retry
            delete originalRequest.headers['Authorization'];
            // Also update the default headers to prevent it from being added again if axios somehow re-merges
            delete api.defaults.headers.common['Authorization'];

            return api(originalRequest);
        }

        // If timeout or network error, retry logic could go here
        // For now, we just log it clearly
        if (error.code === 'ECONNABORTED' || error.response?.status === 504) {
            console.error("Timeout/Network Error - Backend might be sleeping");
        }
        return Promise.reject(error);
    }
);

export default api;
