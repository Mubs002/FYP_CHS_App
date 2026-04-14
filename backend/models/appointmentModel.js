const pool = require('../config/db');

const getAllAppointments = async () => {
    const result = await pool.query(`
            SELECT
            a.*,
            u1.first_name AS patient_name,
            u2.first_name AS doctor_name
            FROM appointments a
            JOIN users u1 ON a.patient_id = u1.user_id
            JOIN users u2 ON a.professional_id = u2.user_id
            ORDER BY a.scheduled_start DESC
            `);
            return result.rows;
};

// i updated this to accept all the appointment fields from the form
const createAppointment = async (patient_id, professional_id, appointment_type, health_category, scheduled_start, scheduled_end, reason_for_visit, meeting_link, location, status) => {
    const result = await pool.query(
        `INSERT INTO appointments
            (patient_id, professional_id, appointment_type, health_category, scheduled_start, scheduled_end, reason_for_visit, meeting_link, location, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`,
            [patient_id, professional_id, appointment_type, health_category, scheduled_start, scheduled_end, reason_for_visit, meeting_link, location, status]
    );

    return result.rows[0];
};
    );

    return result.rows[0];
};

module.exports = {
    getAllAppointments, createAppointment
};