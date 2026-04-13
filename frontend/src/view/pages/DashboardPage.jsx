import { Link } from 'react-router-dom';
import { useAuth } from '../../model/context/AuthContext';
import { useAppointments } from '../../controller/hooks/useAppointments';
import Sidebar from '../components/Sidebar';
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

// the right side with the welcome card stats and recent appointments
function MainContent() {
  const { user } = useAuth();

  // pulling the appointments data using useAppointments from api
  const { appointments, loading, error } = useAppointments();

  // amount of appointments which belong to user
  const myAppointments = appointments.filter(
    (a) => a.patient_id === user.user_id || a.professional_id === user.user_id
  );

  // three recent appoitments to show on the dashboard
  const recentAppointments = myAppointments.slice(0, 3);

  return (
    <main className="dashboard-main">

      {/* top bar with page title and role */}
      <div className="dashboard-topbar">
        <h1 className="dashboard-heading">Dashboard</h1>
        <span className={`role-badge role-badge-${user.role}`}>
          {user.role === 'professional' ? '👨‍⚕️ Doctor' : '🧑 Patient'}
        </span>
      </div>

      {/* welcome card */}
      <div className="welcome-card">
        <h2 className="welcome-title">Welcome back!</h2>
        <p className="welcome-text">
          Here is a summary of your health activity on CHS.
        </p>
      </div>

      {/* three stat cards */}
      <div className="stats-row">
        <div className="stat-card">
          <p className="stat-number">{myAppointments.length}</p>
          <p className="stat-label">Total Appointments</p>
        </div>
        <div className="stat-card">
          <p className="stat-number">{recentAppointments.length}</p>
          <p className="stat-label">Recent Activity</p>
        </div>
        <div className="stat-card">
          <p className="stat-number">{user.role === 'professional' ? '👨‍⚕️' : '🧑'}</p>
          <p className="stat-label">Role: {user.role}</p>
        </div>
      </div>

      {/* recent appointments section */}
      <div className="recent-section">
        <div className="recent-header">
          <h3 className="recent-title">Recent Appointments</h3>
          <Link to="/appointments" className="recent-view-all">View all →</Link>
        </div>

        {/* loading message while the data is being fetched */}
        {loading && <p className="dashboard-loading">Loading appointments...</p>}

        {/* error message if the fetch failed */}
        {error && <p className="dashboard-error">{error}</p>}

        {/* message if there are no appointments yet */}
        {!loading && !error && recentAppointments.length === 0 && (
          <div className="no-appointments">
            <p>No appointments found.</p>
            <Link to="/appointments" className="btn-teal-small">Book an appointment</Link>
          </div>
        )}

        {/* looped through recent appointments and displayed each as a row */}
        {!loading && recentAppointments.length > 0 && (
          <div className="appointments-list">
            {recentAppointments.map((appt) => (
              <div className="appointment-row" key={appt.appointment_id}>
                <div className="appt-info">
                  <p className="appt-reason">{appt.reason_for_visit}</p>
                  <p className="appt-names">
                    {appt.patient_name} → {appt.doctor_name}
                  </p>
                </div>
                <div className="appt-date">
                  {new Date(appt.scheduled_start).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}
