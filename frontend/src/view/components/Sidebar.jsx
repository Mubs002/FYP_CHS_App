import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../model/context/AuthContext';
import './Sidebar.css';

// the shared sidebar used on every page after login
export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // i used useLocation to know which page is currently open
  const location = useLocation();

  // i called logout from authcontext then sent the user back to home
  function handleLogout() {
    logout();
    navigate('/');
  }

  // this checks if the current path matches the link to highlight it
  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <aside className="sidebar">

      {/* chs logo at the top of the sidebar */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <span className="sidebar-logo-text">CHS</span>
      </div>

      {/* nav links - the active one lights up in teal */}
      <nav className="sidebar-nav">
        <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'sidebar-link-active' : ''}`}>
          <span className="sidebar-link-icon">🏠</span>
          Dashboard
        </Link>
        <Link to="/appointments" className={`sidebar-link ${isActive('/appointments') ? 'sidebar-link-active' : ''}`}>
          <span className="sidebar-link-icon">🗓</span>
          Appointments
        </Link>
        <Link to="/health-records" className={`sidebar-link ${isActive('/health-records') ? 'sidebar-link-active' : ''}`}>
          <span className="sidebar-link-icon">📋</span>
          Health Records
        </Link>
        <Link to="/mental-health" className={`sidebar-link ${isActive('/mental-health') ? 'sidebar-link-active' : ''}`}>
          <span className="sidebar-link-icon">💚</span>
          Mental Health
        </Link>
      </nav>

      {/* logout buton at the bottom */}
      <button className="sidebar-logout" onClick={handleLogout}>
        <span className="sidebar-link-icon">🚪</span>
        Logout
      </button>
    </aside>
  );
}
