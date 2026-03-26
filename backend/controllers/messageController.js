const messageModel = require('../models/messageModel');

const getThreads = async (req, res) => {
    try {
        const threads = await messageModel.getAllThreads();
        res.json(threads);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching threads');
    }
};

const addThread = async (req, res) => {
    try {
        const { patient_id, professional_id } = req.body;
        const thread = await messageModel.createThread(patient_id, professional_id);
        res.json(thread);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating thread');
    }
};

const getMessages = async (req, res) => {
    try {
        const { threadId } = req.params;
        const messages = await messageModel.getMessagesByThreadId(threadId);
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching messages');
    }
};

const addMessage = async (req, res) => {
    try {
        const { threadId } = req.params;
        const { sender_user_id, message_body } = req.body;

        const message = await messageModel.sendMessage(threadId, sender_user_id, message_body);
        res.json(message);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error sending message');
    }
};

const updateMessageRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        const updateMessage = await messageModel.markMessageAsRead(messageId);
        res.json(updatedMessage);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating message');
    }
};

module.exports = {
    getThreads,
    addThreads,
    getMessages,
    addMessage,
    updateMessageRead
};