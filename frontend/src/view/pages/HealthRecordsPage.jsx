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
}
