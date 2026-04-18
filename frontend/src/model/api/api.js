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

// i added this so professionals can edit appointment details
export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data);

// i added this so the frontend can send accept or decline to the backend
export const updateAppointmentStatus = (id, status) => api.put(`/appointments/${id}/status`, { status });

// Settings
export const getUser = (id) => api.get(`/user/${id}`);
export const updateProfile = (id, data) => api.put(`/user/${id}/profile`, data);
export const updatePassword = (id, data) => api.put(`/user/${id}/password`, data);

// Health Records
export const getHealthRecords = (role, user_id) => api.get(`/health-records?role=${role}&user_id=${user_id}`);

// i used FormData here because the request contains a file upload
export const addHealthRecord = (formData) => api.post('/health-records', formData);
export const shareHealthRecord = (data) => api.post('/health-records/share', data);
export const getSharedProfessionals = (patient_id) => api.get(`/health-records/shared/${patient_id}`);

//msgs
export const getThreads = () => api.get('/threads');
export const addThread = (data) => api.post('/threads', data);
export const getMessages = (threadId) => api.get(`/threads/${threadId}/messages`);
export const sendMessage = (threadId, data) => api.post(`/threads/${threadId}/messages`, data);
export const markAsRead = (messageId) => api.put(`/messages/${messageId}/read`);