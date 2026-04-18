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
        {/* i showed the user id so patients and professionals can share it with each other */}
        <p className="welcome-user-id">Your ID: <strong>{user.user_id}</strong></p>
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

      {loading && <p className="dashboard-loading">Loading...</p>}
      {error && <p className="dashboard-error">{error}</p>}

      {/* professionals see incoming requests with accept and decline buttons */}
      {user.role === 'professional' && (
        <PendingRequestsSection
          requests={pendingRequests}
          updateStatus={updateStatus}
        />
      )}

      {/* patients see all their requests with the current status */}
      {user.role === 'patient' && (
        <MyRequestsSection requests={myRequests} />
      )}

    </main>
  );
}

// section shown to professionals with all pending requests
function PendingRequestsSection({ requests, updateStatus }) {
  return (
    <div className="recent-section">
      <div className="recent-header">
        <h3 className="recent-title">Appointment Requests</h3>
        <Link to="/appointments" className="recent-view-all">View all →</Link>
      </div>

      {requests.length === 0 && (
        <p className="no-data-text">No pending requests.</p>
      )}

      {/* each pending request row with accept and decline buttons */}
      {requests.map((appt) => (
        <div className="appointment-row" key={appt.appointment_id}>
          <div className="appt-info">
            <p className="appt-reason">{appt.reason_for_visit}</p>
            <p className="appt-names">From: {appt.patient_name} · {appt.appointment_type}</p>
          </div>
          <div className="appt-actions">
            {/* i called updateStatus with confirmed when the button is clicked */}
            <button
              className="btn-accept"
              onClick={() => updateStatus(appt.appointment_id, 'confirmed')}
            >
              Accept
            </button>
            <button
              className="btn-decline"
              onClick={() => updateStatus(appt.appointment_id, 'cancelled')}
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// section shown to patients with their requests and current status
function MyRequestsSection({ requests }) {
  return (
    <div className="recent-section">
      <div className="recent-header">
        <h3 className="recent-title">My Appointment Requests</h3>
        <Link to="/appointments" className="recent-view-all">Book new →</Link>
      </div>

      {requests.length === 0 && (
        <div className="no-appointments">
          <p>No requests made yet.</p>
          <Link to="/appointments" className="btn-teal-small">Book an appointment</Link>
        </div>
      )}

      {/* each request row with a colour coded status badge */}
      {requests.map((appt) => (
        <div className="appointment-row" key={appt.appointment_id}>
          <div className="appt-info">
            <p className="appt-reason">{appt.reason_for_visit}</p>
            <p className="appt-names">
              {appt.appointment_type} · {new Date(appt.scheduled_start).toLocaleDateString()}
            </p>
          </div>
          {/* i used different colours for each status to make it clear */}
          <span className={`status-badge status-${appt.status}`}>
            {appt.status}
          </span>
        </div>
      ))}
    </div>
  );
}
