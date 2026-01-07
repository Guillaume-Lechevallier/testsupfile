const shareService = require('../services/shareService');
const path = require('path');

const shareController = {
    createPublicLink: async (req, res, next) => {
        try {
            const { expirationDays } = req.body; 
            const result = await shareService.generatePublicLink(
                req.params.fileId, 
                expirationDays // par defaut 2 
            );
            res.json(result); 
        } catch (error) {
            next(error);
        }
    },
    
    accessShare: async (req, res, next) => { 
        try {
            const file = await shareService.getFileByShareToken(req.params.token);
            const filePath = path.join(process.cwd(), file.physical_path); // process.cwd -> racine du projet
            res.download(filePath, file.name);  // dl automatique quand on clique sur le lien
        } catch (error) {
            next(error);
        }
    },

    shareInternal: async (req, res, next) => {
        try {
            const { folderId, email } = req.body;
            const ownerId = req.user.id;

            const result = await shareService.shareFolderWithUser(folderId, email, ownerId);
            res.json({ message: `Dossier partagé avec ${result.email}` });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = shareController;