import { useState, useEffect } from 'react';
import { useAuth } from '../../model/context/AuthContext';
import { getUser, updateProfile, updatePassword } from '../../model/api/api';
import Sidebar from '../components/Sidebar';
import './SettingsPage.css';

export default function SettingsPage() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <SettingsContent />
    </div>
  );
}

function SettingsContent() {
  const { user } = useAuth();

  return (
    <main className="dashboard-main">
      <div className="dashboard-topbar">
        <h1 className="dashboard-heading">Settings</h1>
      </div>

      {/* profile amd password sections on top of each other */}
      <ProfileSection userId={user.user_id} />
      <PasswordSection userId={user.user_id} />
    </main>
  );
}

// the section where users can update their name and email
function ProfileSection({ userId }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // i fetched the current user info to pre fill the form fields
    async function loadUser() {
      try {
        const res = await getUser(userId);
        setFirstName(res.data.first_name);
        setLastName(res.data.last_name);
        setEmail(res.data.email);
      } catch (err) {
        setError('Could not load user info.');
      }
    }
    loadUser();
  }, [userId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      // sent the updated name and email to the backend
      await updateProfile(userId, { first_name: firstName, last_name: lastName, email });
      setSuccess('Profile updated successfully.');
    } catch (err) {
      if (err.response?.data === 'Email already in use') {
        setError('That email is already taken.');
      } else {
        setError('Could not update profile. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="settings-card">
      <h3 className="settings-card-title">Personal Information</h3>
      <p className="settings-card-subtitle">Update your name and email address</p>

      {success && <p className="settings-success">{success}</p>}
      {error && <p className="dashboard-error">{error}</p>}

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">First name</label>
            <input type="text" className="form-input" value={firstName}
              onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Last name</label>
            <input type="text" className="form-input" value={lastName}
              onChange={(e) => setLastName(e.target.value)} required />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email address</label>
          <input type="email" className="form-input" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <button type="submit" className="login-btn settings-btn" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
