import { useState } from 'react';
import { useAuth } from '../../model/context/AuthContext';
import { useHealthRecords } from '../../controller/hooks/useHealthRecords';
import Sidebar from '../components/Sidebar';
import './HealthRecordsPage.css';

// the health records page for both patients and professionals
export default function HealthRecordsPage() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <HealthRecordsContent />
    </div>
  );
}

function HealthRecordsContent() {
  const { user } = useAuth();
  const { records, sharedWith, loading, error, createRecord, shareRecord } = useHealthRecords(user.role, user.user_id);

  // i used this to show or hide the add record form
  const [showForm, setShowForm] = useState(false);

  // i used this to show or hide the share form
  const [showShare, setShowShare] = useState(false);

  return (
    <main className="dashboard-main">

      <div className="dashboard-topbar">
        <h1 className="dashboard-heading">Health Records</h1>

        <div className="topbar-buttons">
          {/* only professionals can add a new record */}
          {user.role === 'professional' && (
            <button className="btn-teal-outline" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Add Record'}
            </button>
          )}

          {/* only patients can share their records */}
          {user.role === 'patient' && (
            <button className="btn-teal-outline" onClick={() => setShowShare(!showShare)}>
              {showShare ? 'Cancel' : 'Share Records'}
            </button>
          )}
        </div>
      </div>

      {/* form for professionals to add a new health record */}
      {showForm && (
        <AddRecordForm
          professionalId={user.user_id}
          createRecord={createRecord}
          onDone={() => setShowForm(false)}
        />
      )}

      {/* form for patients to share records with a professional */}
      {showShare && (
        <ShareForm
          patientId={user.user_id}
          shareRecord={shareRecord}
          onDone={() => setShowShare(false)}
          sharedWith={sharedWith}
        />
      )}

      {loading && <p className="dashboard-loading">Loading records...</p>}
      {error && <p className="dashboard-error">{error}</p>}

      {/* the list of health records */}
      <div className="records-list">
        {!loading && records.length === 0 && (
          <p className="no-data-text">No health records found.</p>
        )}

        {/* looped through each record and showed it as a card */}
        {records.map((record) => (
          <RecordCard key={record.record_id} record={record} userRole={user.role} />
        ))}
      </div>

    </main>
  );
}

// each individual health record shown as a card
function RecordCard({ record, userRole }) {
  // i used this to expand or collapse the full details of a record
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="record-card">
      <div className="record-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="record-left">
          <span className="record-category-badge">{record.record_category}</span>
          <p className="record-title">{record.title}</p>
          <p className="record-meta">
            {record.record_date}
            {userRole === 'professional' && record.patient_name && ` · Patient: ${record.patient_name}`}
            {userRole === 'patient' && record.professional_name && ` · Dr. ${record.professional_name}`}
          </p>
        </div>
        <span className="record-expand-icon">{expanded ? '▲' : '▼'}</span>
      </div>

      {/* expanded section shows all the record details */}
      {expanded && (
        <div className="record-details">
          {record.description && (
            <div className="record-field">
              <p className="record-field-label">Description</p>
              <p className="record-field-value">{record.description}</p>
            </div>
          )}
          {record.diagnosis && (
            <div className="record-field">
              <p className="record-field-label">Diagnosis</p>
              <p className="record-field-value">{record.diagnosis}</p>
            </div>
          )}
          {record.treatment_plan && (
            <div className="record-field">
              <p className="record-field-label">Treatment Plan</p>
              <p className="record-field-value">{record.treatment_plan}</p>
            </div>
          )}

          {/* if a file was attached i showed a download link */}
          {record.file_path && (
            <div className="record-field">
              <p className="record-field-label">Attached File</p>
              <a
                href={`http://localhost:3000/uploads/${record.file_path}`}
                target="_blank"
                rel="noreferrer"
                className="record-file-link"
              >
                📎 View / Download File
              </a>
            </div>
          )}

          {record.is_sensitive && (
            <span className="sensitive-badge">🔒 Sensitive Record</span>
          )}
        </div>
      )}
    </div>
  );
}

// the form professionals use to add a new health record
function AddRecordForm({ professionalId, createRecord, onDone }) {
  const [patientId, setPatientId] = useState('');
  const [category, setCategory] = useState('physical');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [recordDate, setRecordDate] = useState('');
  const [isSensitive, setIsSensitive] = useState(false);

  // i stored the actual file object the user picked
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      // i used formdata as reequest includes a file upload
      const formData = new FormData();
      formData.append('patient_id', patientId);
      formData.append('record_category', category);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('diagnosis', diagnosis);
      formData.append('treatment_plan', treatmentPlan);
      formData.append('created_by_professional_id', professionalId);
      formData.append('record_date', recordDate);
      formData.append('is_sensitive', isSensitive);

      if (file) {
        formData.append('file', file);
      }

      await createRecord(formData);
      onDone();
    } catch (err) {
      setFormError('Could not save the record. Please check the details.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="booking-form-card">
      <h3 className="booking-form-title">Add Health Record</h3>

      {formError && <p className="dashboard-error">{formError}</p>}

      <form onSubmit={handleSubmit} className="booking-form">

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Patient ID</label>
            <input type="number" className="form-input" placeholder="Enter patient user ID"
              value={patientId} onChange={(e) => setPatientId(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="physical">Physical</option>
              <option value="mental">Mental</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" className="form-input" placeholder="e.g. Annual checkup"
              value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Record date</label>
            <input type="date" className="form-input"
              value={recordDate} onChange={(e) => setRecordDate(e.target.value)} required />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input form-textarea" placeholder="General notes about the visit"
            value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Diagnosis</label>
          <textarea className="form-input form-textarea" placeholder="Diagnosis details"
            value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Treatment plan</label>
          <textarea className="form-input form-textarea" placeholder="Treatment plan details"
            value={treatmentPlan} onChange={(e) => setTreatmentPlan(e.target.value)} />
        </div>

        {/* the file upload input accepts any file type */}
        <div className="form-group">
          <label className="form-label">Attach file (optional)</label>
          <input type="file" className="form-input"
            onChange={(e) => setFile(e.target.files[0])} />
        </div>

        {/* the sensitive checkbox marks the record as private */}
        <div className="form-check">
          <input type="checkbox" id="sensitive" checked={isSensitive}
            onChange={(e) => setIsSensitive(e.target.checked)} />
          <label htmlFor="sensitive" className="form-label">Mark as sensitive</label>
        </div>

        <button type="submit" className="login-btn" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Record'}
        </button>
      </form>
    </div>
  );
}

}
