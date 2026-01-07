const pool = require('../db/db');

const fileItemDao = {

    create: async (fileData) => {
        const { name, physicalPath, size, isFolder, ownerId, parentId } = fileData;

        const query = `
            INSERT INTO "FileItem" (name, physical_path, size_bytes, is_folder, owner_id, parent_id) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING id
        `;

        const values = [
            name,
            physicalPath,
            size,
            isFolder,
            ownerId,
            parentId
        ];

        const result = await pool.query(query, values);
        return result.rows[0].id;
    },

    delete: async (id, userId) => {

        const query = 'DELETE FROM "FileItem" WHERE id = $1 AND owner_id = $2';
        await pool.query(query, [id, userId]);
    },


    rename: async (id, userId, newName) => {
        const query = 'UPDATE "FileItem" SET name = $1 WHERE id = $2 AND owner_id = $3';
        await pool.query(query, [newName, id, userId]);
    },

    createFolder: async (folderData) => {
        const { name, ownerId, parentId } = folderData;
        const query = `
        INSERT INTO "FileItem" (name, is_folder, owner_id, parent_id)
        VALUES ($1, true, $2, $3)
        RETURNING id
    `;
        const result = await pool.query(query, [name, ownerId, parentId]);
        return result.rows[0].id;
    },

    findByOwnerAndParent: async (userId, parentId) => {

        const params = parentId ? [userId, parentId] : [userId];

        //C'est à moi (owner_id = $1)

        // OU c'est un dossier qu'on m'a partagé (id IN ...)

        //OU c'est un fichier dans un dossier partagé (parent_id IN ...)

        //ET on est dans le bon dossier (parent_id = $2 ou IS NULL) si on tombe sur is null on est à la racine
        // ET on ignore les files dans la corbeille
        const query = `
        SELECT "FileItem".*, "User".email AS owner_email 
        FROM "FileItem"
        LEFT JOIN "User" ON "FileItem".owner_id = "User".id
        WHERE (
            "FileItem".owner_id = $1 
            OR "FileItem".id IN (SELECT folder_id FROM "InternalShare" WHERE shared_with_user_id = $1)
            OR "FileItem".parent_id IN (SELECT folder_id FROM "InternalShare" WHERE shared_with_user_id = $1)
        )
        AND "FileItem".parent_id ${parentId ? '= $2' : 'IS NULL'}
        AND "FileItem".deleted_at IS NULL
        ORDER BY is_folder DESC, name ASC
    `;

        const result = await pool.query(query, params);
        return result.rows;
    },

    getRecentFiles: async (userId) => {
    const query = `
        SELECT * FROM "FileItem" 
        WHERE owner_id = $1 
        AND is_folder = false 
        AND deleted_at IS NULL 
        ORDER BY created_at DESC 
        LIMIT 5
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
},


    // Pour la corbeille
    updateTrashStatus: async (id, userId, isDeleted) => {
        // Si isDeleted est true, on met la date actuelle, sinon on met NULL
        const query = 'UPDATE "FileItem" SET deleted_at = $1 WHERE id = $2 AND owner_id = $3';
        const deletedAt = isDeleted ? new Date() : null;
        await pool.query(query, [deletedAt, id, userId]);
    },
    getTrashFiles: async (userId) => {
        // On récupère tout ce qui appartient à l'user ET qui a une date de suppression
        const query = 'SELECT * FROM "FileItem" WHERE owner_id = $1 AND deleted_at IS NOT NULL ORDER BY deleted_at DESC';
        const result = await pool.query(query, [userId]);
        return result.rows;
    },

    findByIdAndOwner: async (fileId, userId) => {
        const query = 'SELECT * FROM "FileItem" WHERE id = $1 AND owner_id = $2';
        const result = await pool.query(query, [fileId, userId]);
        return result.rows[0];
    },
    getStorageStats: async (userId) => {
        const query = `
        SELECT 
            CASE 
                WHEN name ILIKE '%.jpg' OR name ILIKE '%.png' OR name ILIKE '%.jpeg' THEN 'Images'
                WHEN name ILIKE '%.mp4' OR name ILIKE '%.mkv' THEN 'Vidéos'
                WHEN name ILIKE '%.pdf' OR name ILIKE '%.txt' THEN 'Documents'
                ELSE 'Autres'
            END as category,
            SUM(size_bytes) as size
        FROM "FileItem" 
        WHERE owner_id = $1 AND is_folder = false AND deleted_at IS NULL
        GROUP BY category
    `;
        const result = await pool.query(query, [userId]);
        return result.rows; // [{category: 'Images', size: 5000}, {category: 'Vidéos', size: 12000}, ...]
    },
    findByIdWithSharing: async (fileId, userId) => {
        const query = `
        SELECT f.* FROM "FileItem" f
        WHERE f.id = $1
        AND (
            f.owner_id = $2 
            OR EXISTS (
                SELECT 1 FROM "InternalShare" i 
                WHERE i.folder_id = f.parent_id AND i.shared_with_user_id = $2
            )
        )
    `;
        const result = await pool.query(query, [fileId, userId]);
        return result.rows[0];
    }
};

module.exports = fileItemDao;