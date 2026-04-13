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
}
