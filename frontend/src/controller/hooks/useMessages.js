import { useState, useEffect } from 'react';
import { getThreads, addThread, getMessages, sendMesasge, markAsRead} from '../../model/api/api';

export function useThreads() {
    const [threads, setThreads] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchThreads();
    }, []);
    const fetchThreads = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getThreads();
            setThreads(res.data);
        } catch (err) {
            setError('Could not load conversations.');
        } finally {
            setLoading(false);
        }
    };

    const createThread = async (formData) => {
        setError(null);
        try{
            const res = await addThread(formData);
            setThreads((prev) => [...prev, res.data]);
        } catch (err) {
            SpeechSynthesisErrorEvent
        }
    }
}
