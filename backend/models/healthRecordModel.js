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

// i fetched all records created by a specific professional
const getRecordsByProfessional = async (professional_id) => {
    const result = await pool.query(
        `SELECT hr.*, u.first_name AS patient_name
         FROM health_records hr
         LEFT JOIN users u ON hr.patient_id = u.user_id
         WHERE hr.created_by_professional_id = $1
         ORDER BY hr.record_date DESC`,
        [professional_id]
    );
    return result.rows;
};

// i created a new health record with all the fields from the form
const createRecord = async (data, file_path) => {
    const result = await pool.query(
        `INSERT INTO health_records
            (patient_id, record_category, title, description, diagnosis, treatment_plan, created_by_professional_id, record_date, is_sensitive, file_path)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
            data.patient_id,
            data.record_category,
            data.title,
            data.description || null,
            data.diagnosis || null,
            data.treatment_plan || null,
            data.created_by_professional_id,
            data.record_date,
            data.is_sensitive === 'true',
            file_path || null
        ]
    );
    return result.rows[0];
};

// i added this so patients can share their records with a professional
const shareRecord = async (patient_id, professional_id) => {
    const result = await pool.query(
        `INSERT INTO consents (patient_id, professional_id, consent_type, is_granted, granted_at)
         VALUES ($1, $2, 'view_records', true, NOW())
         RETURNING *`,
        [patient_id, professional_id]
    );
    return result.rows[0];
};

// i fetched all professionals a patient has shared their records with
const getSharedProfessionals = async (patient_id) => {
    const result = await pool.query(
        `SELECT c.*, u.first_name AS professional_name, u.last_name AS professional_last_name
         FROM consents c
         JOIN users u ON c.professional_id = u.user_id
         WHERE c.patient_id = $1 AND c.is_granted = true`,
        [patient_id]
    );
    return result.rows;
};

module.exports = {
    getRecordsByPatient,
    getRecordsByProfessional,
    createRecord,
    shareRecord,
    getSharedProfessionals
};
