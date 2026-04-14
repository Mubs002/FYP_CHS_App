import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
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

// i added this so professionals can edit appointment details
export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data);

// i added this so the frontend can send accept or decline to the backend
export const updateAppointmentStatus = (id, status) => api.put(`/appointments/${id}/status`, { status });

//msgs
export const getThreads = () => api.get('/threads');
export const addThread = (data) => api.post('/threads', data);
export const getMessages = (threadId) => api.get(`/threads/${threadId}/messages`);
export const sendMessage = (threadId, data) => api.post(`/threads/${threadId}/messages`, data);
export const markAsRead = (messageId) => api.put(`/messages/${messageId}/read`);