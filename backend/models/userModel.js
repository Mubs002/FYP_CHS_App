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

// i added this so users can update their name and email from the settings page
const updateUserProfile = async (userId, first_name, last_name, email) => {
    const result = await pool.query(
        `UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE user_id = $4 RETURNING user_id, first_name, last_name, email, role`,
        [first_name, last_name, email, userId]
    );
    return result.rows[0];
};

// i added this so users can change their password from the settings page
const updateUserPassword = async (userId, hashedPassword) => {
    await pool.query(
        `UPDATE users SET password_hash = $1 WHERE user_id = $2`,
        [hashedPassword, userId]
    );
};

// i added this to fetch a single user by their id for the settings page
const getUserById = async (userId) => {
    const result = await pool.query(
        `SELECT user_id, first_name, last_name, email, role FROM users WHERE user_id = $1`,
        [userId]
    );
    return result.rows[0];
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    updateUserProfile,
    updateUserPassword,
    createPatientProfile,
    createProfessionalProfile
};