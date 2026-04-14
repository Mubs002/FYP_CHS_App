import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./model/context/AuthContext";
import { useAuth } from "./model/context/AuthContext";

import LandingPage from './view/pages/LandingPage';
import LoginPage from './view/pages/LoginPage';
import RegisterPage from './view/pages/RegisterPage';
import DashboardPage from './view/pages/DashboardPage';
import AppointmentsPage from './view/pages/AppointmentsPage';
import HealthRecordsPage from './view/pages/HealthRecordsPage';
import ConversationsPage from './view/pages/ConversationsPage';
import SettingsPage from './view/pages/SettingsPage';

//Checing if user is logged in and if not sends them to login page

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* the home landing page anyone can see this */}
      <Route path="/" element={<LandingPage />} />

      {/* Public pages which anyone can visit */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* protected pages only logged in users can visit */}
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />

      <Route path="/appointments" element={
        <ProtectedRoute><AppointmentsPage /></ProtectedRoute>
      } />

      <Route path="/health-records" element={
        <ProtectedRoute><HealthRecordsPage /></ProtectedRoute>
      } />

      <Route path="/mental-health" element={
        <ProtectedRoute><ConversationsPage /></ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute><SettingsPage /></ProtectedRoute>
      } />

      {/* anything else redircts to home */}
      <Route path="*" element={<Navigate to="/" />} />
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