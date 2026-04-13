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
}
