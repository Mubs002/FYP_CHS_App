import { useState, useEffect } from 'react';
import { getAppointments, addAppointment } from '../../model/api/api';

export function useAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getAppointments();
            setAppointments(res.data);
        } catch (err) {
            setError('Could not load appointments.');
        } finally {
            setLoading(false);
        }
    };

    const createAppointment = async (formData) => {
        setError(null);
        try {
            const res = await addAppointment(formData);
            setAppointments((prev) => [...prev, res.data]);
        } catch (err) {
            setError('Could not book appointment. Try again');
        }
    };

    return { appointments, createAppointment, error, loading };
}