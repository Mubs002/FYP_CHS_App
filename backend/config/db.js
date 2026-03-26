const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'chs_db',
    password: 'ftatt123',
    port: 5432,
});

module.exports = pool;