

import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

console.log('🔗 API Base URL:', api.defaults.baseURL);
export default api;