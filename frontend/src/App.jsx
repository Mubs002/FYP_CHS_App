import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./model/context/AuthContext";
import { useAuth } from "./model/context/AuthContext";

import LoginPage from './view/pages/LoginPage';
import RegisterPage from './view/pages/RegisterPage';
import DashboardPage from './view/pages/DashboardPage';
import AppointmentsPage from './view/pages/AppointmentsPage';
import HealthRecordsPage from './view/pages/HealthRecordsPage';
import MentalHealthPage from './view/pages/MentalHealthPage';

//Checing if user is logged in and if not sends them to login page

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if(!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* public page which anyone can visit */}
      <Route path ="/login" element={<LoginPage />} />
      <Route path ="/register" element={<RegisterPage />} />

      { /* Protected pages which only logged in users can visit */}
      <Route path ="/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />

        <Route path ="/appointments" element={
        <ProtectedRoute><AppointmentsPage /></ProtectedRoute>
        } />

        <Route path ="/health-records" element={
        <ProtectedRoute><HealthRecordsPage /></ProtectedRoute>
        } />
        
        <Route path ="/mental-health" element={
        <ProtectedRoute><MentalHealthPage /></ProtectedRoute>
        } />

        { /* if someone visits home page send them to login */}
        <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}