import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { registerUser } from '../../model/api/api';
import './RegisterPage.css';

export default function RegisterPage() {
  const navigate = useNavigate();

  // reading the role that was passed from the landing page role selection
  const location = useLocation();
  const passedRole = location.state?.role || 'patient';
}
