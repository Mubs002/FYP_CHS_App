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
}
