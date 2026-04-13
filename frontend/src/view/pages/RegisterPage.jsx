import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { registerUser } from '../../model/api/api';
import './RegisterPage.css';

export default function RegisterPage() {
  const navigate = useNavigate();

  // reading the role that was passed from the landing page role selection
  const location = useLocation();
  const passedRole = location.state?.role || 'patient';

  //form field in its own state variable
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // role defaults to whatever user picked landing pagee
  const [role, setRole] = useState(passedRole);

  // shows an error message if registration fails
  const [error, setError] = useState('');

  // disables button while the request is in progress
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    // stopping the form from refreshing the page on submit
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // sending all the form data to the backend register route
      await registerUser({
        role,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });

      // redirected to login after registration
      navigate('/login');
    } catch (err) {
      //if email is already taken
      if (err.response?.data === 'Email already exists') {
        setError('That email is already registered. Try signing in instead.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">

      {/* teal banner at the top */}
      <div className="register-header">
        <Link to="/" className="register-back-link">← Back to home</Link>
      </div>

      {/* white card in the centre of the page with the form inside */}
      <div className="register-card-wrapper">
        <div className="register-card">

          {/* shield icon */}
          <div className="register-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Join CHS to manage your health</p>

          {/* role togglee */}
          <div className="role-toggle">
            <button
              type="button"
              className={`role-toggle-btn ${role === 'patient' ? 'role-toggle-active' : ''}`}
              onClick={() => setRole('patient')}
            >
              Patient
            </button>
            <button
              type="button"
              className={`role-toggle-btn ${role === 'professional' ? 'role-toggle-active' : ''}`}
              onClick={() => setRole('professional')}
            >
              Doctor
            </button>
          </div>

          {/* red error box only when there is an error */}
          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Smith"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* the create account buton disables while loading */}
            <button
              type="submit"
              className="register-btn"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* link back to login if the user already has an account */}
          <p className="register-login-link">
            Already have an account?{' '}
            <Link to="/login" className="register-link">Sign in</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
