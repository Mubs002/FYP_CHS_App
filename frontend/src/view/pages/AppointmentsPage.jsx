import { useState } from 'react';
import { useAuth } from '../../model/context/AuthContext';
import { useAppointments } from '../../controller/hooks/useAppointments';
import Sidebar from '../components/Sidebar';
import './AppointmentsPage.css';

// the appointments pagee where users can view and book appointments
export default function AppointmentsPage() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <AppointmentsContent />
    </div>
  );
}

function AppointmentsContent() {
  const { user } = useAuth();

  // i used this to toggle the booking form on and off
  const [showForm, setShowForm] = useState(false);

  // i used this to track which appointment is being edited by the professional
  const [editingId, setEditingId] = useState(null);

  const { appointments, loading, error, createAppointment, editAppointment, updateStatus } = useAppointments();

  // filtered to only show appointments that belong to this user
  const myAppointments = appointments.filter(
    (a) => a.patient_id === user.user_id || a.professional_id === user.user_id
  );

  return (
    <main className="dashboard-main">

      <div className="dashboard-topbar">
        <h1 className="dashboard-heading">Appointments</h1>

        {/* book appointments */}
        <button className="btn-teal-outline" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Book Appointment'}
        </button>
      </div>

      {/* booking form shown when button is clicked */}
      {showForm && (
        <BookingForm
          user={user}
          createAppointment={createAppointment}
          onBooked={() => setShowForm(false)}
        />
      )}

      <div className="appointments-card">
        <h3 className="appointments-card-title">Your Appointments</h3>

        {loading && <p className="dashboard-loading">Loading...</p>}
        {error && <p className="dashboard-error">{error}</p>}

        {!loading && myAppointments.length === 0 && (
          <p className="no-data-text">No appointments yet.</p>
        )}

        {!loading && myAppointments.map((appt) => (
          <div key={appt.appointment_id}>

            <div className="appt-full-row">
              <div className="appt-left">
                <p className="appt-reason">{appt.reason_for_visit}</p>
                <p className="appt-names">{appt.patient_name} → {appt.doctor_name}</p>
                <p className="appt-meta">
                  {appt.appointment_type} · {appt.health_category}
                  {appt.scheduled_start && ` · ${new Date(appt.scheduled_start).toLocaleString()}`}
                </p>
                {/* show the meeting link or location theres 1 that has been set */}
                {appt.meeting_link && (
                  <a href={appt.meeting_link} className="appt-link" target="_blank" rel="noreferrer">
                    Join Meeting
                  </a>
                )}
                {appt.location && (
                  <p className="appt-meta">📍 {appt.location}</p>
                )}
              </div>
              <div className="appt-right">
                <span className={`status-badge status-${appt.status}`}>{appt.status}</span>
                <span className="appt-type-badge">{appt.appointment_type}</span>

                {/* professionals can accept or decline pending requests */}
                {user.role === 'professional' && appt.status === 'pending' && (
                  <div className="appt-actions">
                    <button className="btn-accept" onClick={() => updateStatus(appt.appointment_id, 'confirmed')}>Accept</button>
                    <button className="btn-decline" onClick={() => updateStatus(appt.appointment_id, 'cancelled')}>Decline</button>
                  </div>
                )}

                {/* professionals can edit confirmed appointments */}
                {user.role === 'professional' && appt.status === 'confirmed' && (
                  <button
                    className="btn-edit"
                    onClick={() => setEditingId(editingId === appt.appointment_id ? null : appt.appointment_id)}
                  >
                    {editingId === appt.appointment_id ? 'Cancel Edit' : 'Edit Details'}
                  </button>
                )}
              </div>
            </div>

            {/* edit form shown below the row when onlyy the professional clicks edit details */}
            {editingId === appt.appointment_id && (
              <EditForm
                appt={appt}
                editAppointment={editAppointment}
                onDone={() => setEditingId(null)}
              />
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
}
