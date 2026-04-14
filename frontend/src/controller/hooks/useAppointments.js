import { useState, useEffect } from 'react';
import { getAppointments, addAppointment, updateAppointment, updateAppointmentStatus } from '../../model/api/api';

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

    // i added this so professionals can edit the appointment details
    const editAppointment = async (appointmentId, data) => {
        setError(null);
        try {
            const res = await updateAppointment(appointmentId, data);
            setAppointments((prev) =>
                prev.map((a) => a.appointment_id === res.data.appointment_id ? res.data : a)
            );
        } catch (err) {
            setError('Could not update appointment.');
        }
    };

    // i added this so professionals can accept or decline a request
    const updateStatus = async (appointmentId, status) => {
        setError(null);
        try {
            const res = await updateAppointmentStatus(appointmentId, status);
            setAppointments((prev) =>
                prev.map((a) => a.appointment_id === res.data.appointment_id ? res.data : a)
            );
        } catch (err) {
            setError('Could not update appointment status.');
        }
    };

    return { appointments, createAppointment, editAppointment, updateStatus, error, loading };
}
