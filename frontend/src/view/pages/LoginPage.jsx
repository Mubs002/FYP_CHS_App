import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../model/api/api';
import { useAuth } from '../../model/context/AuthContext';
import './LoginPage.css';

// the login page where existing users sign into their account
export default function LoginPage() {
  // i stored the email and password the user typed into the form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // show an error message if login fails
  const [error, setError] = useState('');

  // disable the button while the request is being sent
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // this runs when the user clicks the sign in button
  async function handleSubmit(e) {
    // stopped the page from refreshing when the form submits
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // sends the email and password to the backend login route
      const res = await loginUser({ email, password });

      // saves the token and user info using the login function from authcontext
      login({
        token: res.data.token,
        role: res.data.role,
        user_id: res.data.user_id,
      });

      // redirected the user to the dashboard after a succesful login
      navigate('/dashboard');
    } catch (err) {
      // showed an error mesage if the backend returned a failure
      setError('Incorrect email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      {/* baner at the top*/}
      <div className="login-header">
        <Link to="/" className="login-back-link">← Back to home</Link>
      </div>

      {/* white card in the centre of the page */}
      <div className="login-card-wrapper">
        <div className="login-card">

          {/*shield iconn */}
          <div className="login-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your CHS account</p>

          {/* red box only when there is an error from the backend */}
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* the main login form with email and password */}
          <form onSubmit={handleSubmit} className="login-form">

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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* sign in buton goes teal and shows loading text while waiting */}
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* link to the register pagee */}
          <p className="login-register-link">
            Don't have an account?{' '}
            <Link to="/register" className="login-link">Create one</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
