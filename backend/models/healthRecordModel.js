const pool = require('../config/db');

// i fetched all records for a specific patient
const getRecordsByPatient = async (patient_id) => {
    const result = await pool.query(
        `SELECT hr.*, u.first_name AS professional_name
         FROM health_records hr
         LEFT JOIN users u ON hr.created_by_professional_id = u.user_id
         WHERE hr.patient_id = $1
         ORDER BY hr.record_date DESC`,
        [patient_id]
    );
    return result.rows;
};
