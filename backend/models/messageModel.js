const pool = require('../config/db');

const getAllThreads = async() => {
    const result = await pool.query(`
            SELECT
            mt.thread_id,
            mt.patient_id,
            mt.professional_id,
            p.first_name AS patient_first_name,
            p.last_name AS patient_last_name,
            d.first_name AS professional_first_name,
            d.last_name AS professional_last_name,
            mt.created_at
            FROM message_threads mt
            JOIN users p ON mt.patient_id = p.user_id
            JOIN users d ON mt.professional_id = d.user_id
            ORDER BY mt.created_at DESC
    `);

    return result.rows;
};

const createThread = async (patient_id, professional_id) => {
    const result = await pool.query(
            `INSERT INTO message_threads (patient_id, professional_id)
            VALUES ($1, $2)
            RETURNING *`,
            [patient_id, professional_id]
    );
    return result.rows[0];
};

const getMessagesByThreadId = async (threadId) => {
    const result = await pool.query(
            `SELECT
            m.message_id,
            m.thread_id,
            m.sender_user_id,
            u.first_name,
            u.last_name,
            u.role,
            m.message_body,
            m.sent_at,
            m.is_read,
            m.read_at
            FROM messages m
            JOIN users u ON m.sender_user_id = u.user_id
            WHERE m.thread_id = $1
            ORDER BY m.sent_at ASC`,
            [threadId]
    );

    return result.rows;
};

const sendMessage = async (threadId, sender_user_id, message_body) => {
    const result = await pool.query(
            `INSERT INTO messages (thread_id, sender_user_id, message_body)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [threadId, sender_user_id, message_body]
    );
    return result.rows[0];
};

const markMessageAsRead = async (messageId) => {
    const result = await pool.query(
            `UPDATE messages
            SET is_read = TRUE,
            read_at = CURRENT_TIMESTAMP
            WHERE message_id = $1
            RETURNING *`,
        [messageId]
    );
    return result.rows[0];
};

module.exports = {
    getAllThreads,
    createThread,
    getMessagesByThreadId,
    sendMessage,
    markMessageAsRead
};