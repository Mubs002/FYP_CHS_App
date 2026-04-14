const pool = require('../config/db');

const createUser = async (role, first_name, last_name, email, hashedPassword) => {
    const result = await pool.query(
            `INSERT INTO users
            (role, first_name, last_name, email, password_hash)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING user_id, email`,
            [role, first_name, last_name, email, hashedPassword]
    );

    return result.rows[0];
};

const getUserByEmail = async (email) => {
    const result = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
    );
    return result.rows[0];
};

// i added this so a patient_profiles gets created when a patient registers
const createPatientProfile = async (userId) => {
    await pool.query(
        `INSERT INTO patient_profiles (patient_id) VALUES ($1)`,
        [userId]
    );
};

// i added this so a professional_profiles gets created when a professional registers
// i used the userId in the license number so it is unique for every professional
const createProfessionalProfile = async (userId) => {
    await pool.query(
        `INSERT INTO professional_profiles (professional_id, specialism, license_number) VALUES ($1, 'General', $2)`,
        [userId, `TEMP-${userId}`]
    );
};

module.exports = {
    createUser,
    getUserByEmail,
    createPatientProfile,
    createProfessionalProfile
};