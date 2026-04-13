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
}
