import { useState, useEffect } from 'react';
import { getHealthRecords, addHealthRecord, shareHealthRecord, getSharedProfessionals } from '../../model/api/api';

export function useHealthRecords(role, userId) {
    const [records, setRecords] = useState([]);
    const [sharedWith, setSharedWith] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRecords();
        // i only fetched the shared list if the user is a patient
        if (role === 'patient') {
            fetchShared();
        }
    }, []);

    const fetchRecords = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getHealthRecords(role, userId);
            setRecords(res.data);
        } catch (err) {
            setError('Could not load health records.');
        } finally {
            setLoading(false);
        }
    };

    const createRecord = async (formData) => {
        setError(null);
        try {
            const res = await addHealthRecord(formData);
            setRecords((prev) => [res.data, ...prev]);
        } catch (err) {
            setError('Could not create health record.');
        }
    };

    const shareRecord = async (patientId, professionalId) => {
        setError(null);
        try {
            await shareHealthRecord({ patient_id: patientId, professional_id: professionalId });
}
