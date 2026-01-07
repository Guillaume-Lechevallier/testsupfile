const pool = require('../db/db');

const userDao = {


    create: async (email, hashedPassword) => {
        const result = await pool.query(
            'INSERT INTO "User" (email, password_hash) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        return result.rows[0];
    },
    findById: async (id) => {
        const query = 'SELECT id, email, password_hash FROM "User" WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    findByEmail: async (email) => {
        const result = await pool.query('SELECT id, email, password_hash FROM "User" WHERE email = $1', [email]);
        return result.rows[0];
    },
    updatePassword: async (userId, newHashedPassword) => {
        const query = 'UPDATE "User" SET password_hash = $1 WHERE id = $2';
        await pool.query(query, [newHashedPassword, userId]);
    },

    updateEmail: async (userId, newEmail) => {
        const query = 'UPDATE "User" SET email = $1 WHERE id = $2';
        await pool.query(query, [newEmail, userId]);
    }

};

module.exports = userDao;