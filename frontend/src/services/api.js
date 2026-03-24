import axios from 'axios';

const api = axios.create({
    baseURL: '/api' // This will be proxied in Vite config
});

// Request interceptor to add the auth token header to every request
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');

        if (userInfo) {
            const parsedInfo = JSON.parse(userInfo);
            if (parsedInfo.token) {
                config.headers.Authorization = `Bearer ${parsedInfo.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 Unauthorized errors globally if needed
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token might be expired, log user out
            localStorage.removeItem('userInfo');
            // window.location.href = '/login'; 
            // Handled gently, rely on components catching 401s for smoother UX
        }
        return Promise.reject(error);
    }
);

export default api;
