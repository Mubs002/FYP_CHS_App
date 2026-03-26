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

module.exports = {
    createUser,
    getUserByEmail
};