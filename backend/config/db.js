const { Pool } = require('pg');

const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    })
    : new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'chs_db',
        password: 'ftatt123',
        port: 5432,
    });

module.exports = pool;