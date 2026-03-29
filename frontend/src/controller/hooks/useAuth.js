import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../../model/api/api';
import { useAuth } from '../../model.context.AuthContext';

export function useLogin() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await loginUser({ email, password});
            login(res.data);
            navigate('/dashboard');
        } catch (err) {
            setError('Incorrect email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return {handleLogin, error, loading};
}

export function useRegister() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            await registerUser(formData);
            navigate('/login');
        } catch (err) {
            setError('Registration failed. That email is already be in use.');
        } finally {
            setLoading(false);
        }
    };
    return { handleRegister, error, loading };
}