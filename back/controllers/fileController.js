const fileService = require('../services/fileService');
const fileItemDao = require('../dao/fileItemDao');
const path = require('path');
const fs = require('fs'); 

const fileController = {

    upload: async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Aucun fichier fourni." });
            }

            const userId = req.user.id;
            const parentId = req.body.parentId;

            //verif : estce que jai l'droit d'être là ?
            if (parentId) {
                const parentFolder = await fileItemDao.findByIdWithSharing(parentId, userId);

                // Si le dossier n'est pas à moi ou pas partagé avec moi alors....
                if (!parentFolder) {
                    return res.status(403).json({
                        message: "Vous n'avez pas la permission d'ajouter des fichiers dans ce dossier."
                    });
                }
            }

            // On crée le fichier normalement avec le userId de celui qui upload
            const newFile = await fileService.uploadFile(req.file, userId, parentId);
            res.status(201).json(newFile);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            await fileService.moveToTrash(req.params.id, req.user.id);
            res.json({ message: "Placé dans la corbeille !" });
        } catch (error) {
            next(error);
        }
    },

    restore: async (req, res, next) => {
        try {
            const fileId = req.params.id;
            const userId = req.user.id;
            await fileService.restoreFile(fileId, userId);
            res.json({ message: "Fichier restauré avec succès" });
        } catch (error) {
            next(error);
        }
    },

    forceDelete: async (req, res, next) => {
        try {
            const fileId = req.params.id;
            const userId = req.user.id;
            await fileService.hardDelete(fileId, userId);
            res.json({ message: "Fichier supprimé définitivement" });
        } catch (error) {
            next(error);
        }
    },

    getFiles: async (req, res, next) => {
        try {
            const userId = req.user.id;
            const parentId = req.query.parentId; // id envoyé par le front

            const files = await fileService.getUserFiles(userId, parentId);
            res.json(files);
        } catch (error) {
            next(error);
        }
    },

    getTrash: async (req, res, next) => {
        try {
            const trashFiles = await fileItemDao.getTrashFiles(req.user.id);
            res.json(trashFiles);
        } catch (error) {
            next(error);
        }
    },

    download: async (req, res, next) => {
        try {
            const file = await fileItemDao.findByIdWithSharing(req.params.id, req.user.id);
            if (!file) {
                return res.status(404).json({ message: "Accès refusé ou fichier introuvable" });
            }

            const filePath = path.join(process.cwd(), file.physical_path);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ message: "Fichier physique introuvable" });
            }

            // Si l'URL contient "?download=true", on force le téléchargement
            // Sinon on l'envoie normalement pour afficher le preview dans la modale
            if (req.query.download === 'true') {
                return res.download(filePath, file.name);
            } else {
                // sendFile permet au navigateur de décider s'il l'affiche
                return res.sendFile(filePath);
            }

        } catch (error) {
            next(error);
        }
    },

    downloadFolder: async (req, res, next) => {
        try {
            const folderId = req.params.id;
            const userId = req.user.id;
            // On appelle ton service qui gère déjà le ZIP et le pipe vers res
            await fileService.downloadFolder(folderId, userId, res);
        } catch (error) {
            next(error);
        }
    },

    rename: async (req, res, next) => {
        try {
            const { newName } = req.body;
            const fileId = req.params.id;
            const userId = req.user.id;

            await fileService.rename(fileId, userId, newName);
            res.json({ message: "rename ok" });
        } catch (error) {
            next(error);
        }
    },

    createFolder: async (req, res, next) => {
        try {
                        console.log(req.body)

            const { name, parentId } = req.body;
            const userId = req.user.id;

            const folderId = await fileService.createFolder(name, userId, parentId);
            res.status(201).json({ id: folderId, name, is_folder: true });
        } catch (error) {
            next(error);
        }
    },

    getStats: async (req, res, next) => {
        try {
            const stats = await fileService.getStats(req.user.id);
            res.json(stats);
        } catch (error) {
            next(error);
        }
    },
};

module.exports = fileController;