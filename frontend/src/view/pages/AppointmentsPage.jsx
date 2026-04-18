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

// the booking form used by both patients and professionals
function BookingForm({ user, createAppointment, onBooked }) {
  // patients enter a professional id professionals enter a patient id
  const [otherId, setOtherId] = useState('');
  const [reason, setReason] = useState('');
  const [appointmentType, setAppointmentType] = useState('online');
  const [healthCategory, setHealthCategory] = useState('physical');
  const [scheduledStart, setScheduledStart] = useState('');
  const [scheduledEnd, setScheduledEnd] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      //set patient and professional id based on who is booking
      // i also set status to confirmed straight away when a professional books
      await createAppointment({
        patient_id: user.role === 'patient' ? user.user_id : otherId,
        professional_id: user.role === 'professional' ? user.user_id : otherId,
        appointment_type: appointmentType,
        health_category: healthCategory,
        scheduled_start: scheduledStart,
        scheduled_end: scheduledEnd,
        reason_for_visit: reason,
        meeting_link: appointmentType === 'online' ? meetingLink : null,
        location: appointmentType === 'in-person' ? location : null,
        booked_by_professional: user.role === 'professional',
      });

      onBooked();
    } catch (err) {
      setFormError('Could not book appointment. Please check the details.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="booking-form-card">
      <h3 className="booking-form-title">
        {user.role === 'professional' ? 'Book Appointment for Patient' : 'Request New Appointment'}
      </h3>

      {formError && <p className="dashboard-error">{formError}</p>}

      <form onSubmit={handleSubmit} className="booking-form">

        {/*label changes depending on who is booking */}
        <div className="form-group">
          <label className="form-label">
            {user.role === 'professional' ? 'Patient ID' : 'Doctor ID'}
          </label>
          <input
            type="number"
            className="form-input"
            placeholder={user.role === 'professional' ? 'Enter patient user ID' : 'Enter doctor user ID'}
            value={otherId}
            onChange={(e) => setOtherId(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Reason for visit</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. General checkup"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>

        {/* the two dropdowns sit side by side */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Appointment type</label>
            <select className="form-input" value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)}>
              <option value="online">Online</option>
              <option value="in-person">In Person</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Health category</label>
            <select className="form-input" value={healthCategory} onChange={(e) => setHealthCategory(e.target.value)}>
              <option value="physical">Physical</option>
              <option value="mental">Mental</option>
            </select>
          </div>
        </div>

        {/* start and end time pickers sit side by side */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Start time</label>
            <input
              type="datetime-local"
              className="form-input"
              value={scheduledStart}
              onChange={(e) => setScheduledStart(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">End time</label>
            <input
              type="datetime-local"
              className="form-input"
              value={scheduledEnd}
              onChange={(e) => setScheduledEnd(e.target.value)}
              required
            />
          </div>
        </div>

        {/* only showed meeting link if the type is online*/}
        {appointmentType === 'online' && (
          <div className="form-group">
            <label className="form-label">Meeting link</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. https://meet.google.com/..."
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          </div>
        )}

        {/* only showed location field if the type is in person */}
        {appointmentType === 'in-person' && (
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. City Hospital, Room 4"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        )}

        <button type="submit" className="login-btn" disabled={submitting}>
          {submitting ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
}

//eedit form shown to professionals on accepted appointments
function EditForm({ appt, editAppointment, onDone }) {
  const [appointmentType, setAppointmentType] = useState(appt.appointment_type || 'online');
  const [healthCategory, setHealthCategory] = useState(appt.health_category || 'physical');

  // pre filled the start and end times with what was already saved
  const [scheduledStart, setScheduledStart] = useState(
    appt.scheduled_start ? new Date(appt.scheduled_start).toISOString().slice(0, 16) : ''
  );
  const [scheduledEnd, setScheduledEnd] = useState(
    appt.scheduled_end ? new Date(appt.scheduled_end).toISOString().slice(0, 16) : ''
  );
  const [meetingLink, setMeetingLink] = useState(appt.meeting_link || '');
  const [location, setLocation] = useState(appt.location || '');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    await editAppointment(appt.appointment_id, {
      appointment_type: appointmentType,
      health_category: healthCategory,
      scheduled_start: scheduledStart,
      scheduled_end: scheduledEnd,
      meeting_link: appointmentType === 'online' ? meetingLink : null,
      location: appointmentType === 'in-person' ? location : null,
    });

    onDone();
  }

  return (
    <div className="edit-form-card">
      <h4 className="booking-form-title">Edit Appointment Details</h4>

      <form onSubmit={handleSubmit} className="booking-form">

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Appointment type</label>
            <select className="form-input" value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)}>
              <option value="online">Online</option>
              <option value="in-person">In Person</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Health category</label>
            <select className="form-input" value={healthCategory} onChange={(e) => setHealthCategory(e.target.value)}>
              <option value="physical">Physical</option>
              <option value="mental">Mental</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Start time</label>
            <input type="datetime-local" className="form-input" value={scheduledStart} onChange={(e) => setScheduledStart(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">End time</label>
            <input type="datetime-local" className="form-input" value={scheduledEnd} onChange={(e) => setScheduledEnd(e.target.value)} required />
          </div>
        </div>

        {appointmentType === 'online' && (
          <div className="form-group">
            <label className="form-label">Meeting link</label>
            <input type="text" className="form-input" placeholder="https://meet.google.com/..." value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} />
          </div>
        )}

        {appointmentType === 'in-person' && (
          <div className="form-group">
            <label className="form-label">Location</label>
            <input type="text" className="form-input" placeholder="e.g. City Hospital Room 4" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
        )}

        <button type="submit" className="login-btn" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
