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

}
