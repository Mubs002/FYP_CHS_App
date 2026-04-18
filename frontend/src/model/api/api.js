import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

//Attaching token to request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

//auth
export const registerUser = (data) => api.post('/register', data);
export const loginUser = (data) => api.post('/login', data);

// Appointmet
export const getAppointments = () => api.get('/appointments');
export const addAppointment = (data) => api.post('/appointments', data);

//msgs
export const getThreads = () => api.get('/threads');
export const addThread = (data) => api.post('/threads', data);
export const getMessages = (threadId) => api.get(`/threads/${threadId}/messages`);
export const sendMessage = (threadId, data) => api.post(`/threads/${threadId}/messages`, data);
export const markAsRead = (messageId) => api.put(`/messages/${messageId}/read`);