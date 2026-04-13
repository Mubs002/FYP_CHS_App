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

//left sidebar with navigation links and logout button
function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // calling logout from authcontext then sent the user back to the home page
  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <aside className="sidebar">

      {/* chs logo and name at the top of the sidebar */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <span className="sidebar-logo-text">CHS</span>
      </div>

      {/* navigationn */}
      <nav className="sidebar-nav">
        <Link to="/dashboard" className="sidebar-link sidebar-link-active">
          <span className="sidebar-link-icon">🏠</span>
          Dashboard
        </Link>
        <Link to="/appointments" className="sidebar-link">
          <span className="sidebar-link-icon">🗓</span>
          Appointments
        </Link>
        <Link to="/health-records" className="sidebar-link">
          <span className="sidebar-link-icon">📋</span>
          Health Records
        </Link>
        <Link to="/mental-health" className="sidebar-link">
          <span className="sidebar-link-icon">💚</span>
          Mental Health
        </Link>
      </nav>

      {/* logout buton*/}
      <button className="sidebar-logout" onClick={handleLogout}>
        <span className="sidebar-link-icon">🚪</span>
        Logout
      </button>
    </aside>
  );
}
}
