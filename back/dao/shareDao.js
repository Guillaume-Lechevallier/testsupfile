const pool = require('../db/db');

const shareDao = {
    createShare: async (fileId, token, expires_at) => {
        const query = `
            INSERT INTO "Share" (file_item_id, unique_url_token, expires_at) 
            VALUES ($1, $2, $3) 
            RETURNING unique_url_token;
        `;
        const result = await pool.query(query, [fileId, token, expires_at]);
        return result.rows[0];
    },

    getShareByToken: async (token) => {
        const query = `
            SELECT f.*, s.expires_at 
            FROM "FileItem" f
            JOIN "Share" s ON s.file_item_id = f.id
            WHERE s.unique_url_token = $1
        `;
        const result = await pool.query(query, [token]);
        return result.rows[0];
    },
    createInternalShare: async (folderId, userId) => {
        const query = `
        INSERT INTO "InternalShare" (folder_id, shared_with_user_id) 
        VALUES ($1, $2) 
        ON CONFLICT (folder_id, shared_with_user_id) DO NOTHING
    `;
        await pool.query(query, [folderId, userId]);
    },
};

module.exports = shareDao;