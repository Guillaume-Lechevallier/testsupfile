const fileItemDao = require('../dao/fileItemDao');
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const QUOTA_GB = 30;
const QUOTA_BYTES = QUOTA_GB * 1024 * 1024 * 1024;

const fileService = {

    uploadFile: async (file, userId, parentId) => {
        const stats = await fileItemDao.getStorageStats(userId);
        let currentUsedBytes = 0;

        for (const item of stats) {
            currentUsedBytes += parseInt(item.size);
        }

        // verif 
        const newTotalSize = currentUsedBytes + file.size;

        if (newTotalSize > QUOTA_BYTES) {
            // delete du fichier car multer le creer temporairement
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            const error = new Error("Quota de stockage dépassé (30 Go max).");
            error.status = 403;
            throw error;
        }

        const fileData = {
            name: file.originalname,
            physicalPath: file.path,
            size: file.size,
            isFolder: false,
            ownerId: userId,
            parentId: parentId || null // si null : racine
        };

        const fileId = await fileItemDao.create(fileData);
        return { id: fileId, ...fileData };
    },

    moveToTrash: async (fileId, userId) => {
        const file = await fileItemDao.findByIdAndOwner(fileId, userId);
        if (!file) {
            const error = new Error("Élément introuvable ou accès refusé");
            error.status = 404;
            throw error;
        }
        return await fileItemDao.updateTrashStatus(fileId, userId, true);
    },

    restoreFile: async (fileId, userId) => {
        const file = await fileItemDao.findByIdAndOwner(fileId, userId);
        if (!file) {
            const error = new Error("Élément introuvable ou accès refusé");
            error.status = 404;
            throw error;
        }
        return await fileItemDao.updateTrashStatus(fileId, userId, false);
    },

    hardDelete: async (fileId, userId) => {
        const file = await fileItemDao.findByIdAndOwner(fileId, userId);
        if (!file) {
            const error = new Error("Élément introuvable");
            error.status = 404;
            throw error;
        }

        //  delete du file physique (dossier /uploads à la racine de ./backend)
        if (!file.is_folder && file.physical_path) {
            const filePath = path.join(process.cwd(), file.physical_path);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        // et suppression en bdd
        await fileItemDao.delete(fileId, userId);
    },

    rename: async (id, userId, newName) => {
        if (!newName || newName.trim() === '') {
            const error = new Error("Le nouveau nom est requis");
            error.status = 400;
            throw error;
        }

        const file = await fileItemDao.findByIdAndOwner(id, userId);
        if (!file) {
            const error = new Error("Élément introuvable ou accès refusé");
            error.status = 404;
            throw error;
        }

        return await fileItemDao.rename(id, userId, newName);
    },

    getUserFiles: async (userId, parentId = null) => {
        return await fileItemDao.findByOwnerAndParent(userId, parentId);
    },

    getFileById: async (fileId, userId) => {
        const file = await fileItemDao.findByIdAndOwner(fileId, userId);
        if (!file) {
            const error = new Error("Fichier introuvable ou accès refusé");
            error.status = 404;
            throw error;
        }
        return file;
    },

    createFolder: async (name, userId, parentId) => {
        if (!name || name.trim() === '') {
            const error = new Error("Le nom du dossier est requis");
            error.status = 400;
            throw error;
        }

        return await fileItemDao.createFolder({
            name,
            ownerId: userId,
            parentId: parentId || null
        });
    },

    getStats: async (userId) => {
        const details = await fileItemDao.getStorageStats(userId);
        const recentFiles = await fileItemDao.getRecentFiles(userId);

        let totalUsedBytes = 0;
        for (const category of details) {
            totalUsedBytes += parseInt(category.size);
        }

        const percentage = ((totalUsedBytes / QUOTA_BYTES) * 100).toFixed(1);

        return {
            totalUsedBytes,
            percentage,
            details, // la barre de stockage segmentée (docs : x taille, vidéos : x taille etc..)   
            recentFiles // 5 derniers files
        };
    },

    downloadFolder: async (folderId, userId, res) => {
        const folder = await fileItemDao.findByIdAndOwner(folderId, userId);
        if (!folder || !folder.is_folder) {
            const error = new Error("Dossier introuvable");
            error.status = 404;
            throw error;
        }

        const archive = archiver('zip', { zlib: { level: 9 } });
        const items = await fileItemDao.findByOwnerAndParent(userId, folderId);

        res.attachment(`${folder.name}.zip`);
        archive.pipe(res);

        for (const item of items) {
            if (!item.is_folder) {
                const filePath = path.join(process.cwd(), item.physical_path);
                if (fs.existsSync(filePath)) {
                    // On add le fichier dans larchive
                    archive.file(filePath, { name: item.name });
                }
            }
        }

        await archive.finalize();
    }

};

module.exports = fileService;