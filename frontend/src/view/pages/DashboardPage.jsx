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
  const { appointments, updateStatus, loading, error } = useAppointments();

  // i filtered appointments that belong to this user
  const myAppointments = appointments.filter(
    (a) => a.patient_id === user.user_id || a.professional_id === user.user_id
  );

  // pending requests sent to this professional
  const pendingRequests = appointments.filter(
    (a) => a.professional_id === user.user_id && a.status === 'pending'
  );

  // the patients own requests with their current status
  const myRequests = appointments.filter(
    (a) => a.patient_id === user.user_id
  );

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

      {/* card showing appointment count */}
      <div className="stats-row">
        <div className="stat-card">
          <p className="stat-number">{myAppointments.length}</p>
          <p className="stat-label">Total Appointments</p>
        </div>
        <div className="stat-card">
          {/* professionals see pending count patients see their request count */}
          <p className="stat-number">
            {user.role === 'professional' ? pendingRequests.length : myRequests.length}
          </p>
          <p className="stat-label">
            {user.role === 'professional' ? 'Pending Requests' : 'My Requests'}
          </p>
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
