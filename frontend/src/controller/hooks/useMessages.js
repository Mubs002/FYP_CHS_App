import { useState, useEffect } from 'react';
import { getThreads, addThread, getMessages, sendMessage, markAsRead} from '../../model/api/api';

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
            setError('Could not start conversation.');
        }
    };
    return { threads, createThread, error, loading };
}

export function useMessages(threadId) {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (threadId) fetchMessages();
    }, [threadId]);

    const fetchMessages = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getMessages(threadId);
            setMessages(res.data);
        } catch (err) {
            setError('Could not load messages.');
        } finally {
            setLoading(false);
        }
    };

    const send = async (sender_user_id, message_body) => {
        setError(null);
        try{
            const res = await sendMessage(threadId, { sender_user_id, message_body });
            setMessages((prev) => [...prev, res.data]);
        } catch (err) {
            setError('Could not send message.');
        }
    };
    const markRead = async (messageId) => {
        try {
            await markAsRead(messageId);
            setMessages((prev) =>
            prev.map((m) => m.message_id === messageId ? { ...m, is_read: true } :m)
        );
        } catch (err) {
            console.error('Could not mark message as read');
        }
    };
    return { messages, send, markRead, error, loading};
}
