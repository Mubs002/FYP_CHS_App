import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../model/context/AuthContext';
import { useAppointments } from '../../controller/hooks/useAppointments';
import './DashboardPage.css';

// dashboard page shown after the user logs in
export default function DashboardPage() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <MainContent />
    </div>
  );
}
}
