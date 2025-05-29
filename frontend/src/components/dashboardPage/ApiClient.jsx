import axios from 'axios';
import { BACKEND_URL } from '../../tools/Tools';

const apiClient = axios.create({
    baseURL: `${BACKEND_URL}/api/profile`, // Targets /profile route on your backend
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Include this if you're using cookies for auth
});

export default apiClient;
