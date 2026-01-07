const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,     
    host: process.env.DB_HOST, 
    database: process.env.DB_NAME,      
    password: process.env.DB_PASSWORD,  
    port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
    } else {
        console.log('PSQL ok.');
    }
});

module.exports = pool;