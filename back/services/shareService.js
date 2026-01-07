const shareDao = require('../dao/shareDao');
const authDao = require('../dao/authDao');
const fileItemDao = require('../dao/fileItemDao');
const crypto = require('crypto');

const shareService = {
    generatePublicLink: async (fileId, days = 2) => {
        const token = crypto.randomBytes(16).toString('hex');

        // Calcul simple genre date actuelle + 2 jours en loccurence
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + parseInt(days));

        try {
            await shareDao.createShare(fileId, token, expiresAt);
            return { token, expiresAt };
        } catch (error) {
            const err = new Error("Impossible de générer le lien");
            err.status = 500;
            throw err;
        }
    },

    getFileByShareToken: async (token) => {
        const share = await shareDao.getShareByToken(token);

        if (!share) {
            const err = new Error("Lien invalide");
            err.status = 404;
            throw err;
        }

        // vérif expiration
        if (share.expires_at && new Date() > new Date(share.expires_at)) {
            const err = new Error("Ce lien de partage a expiré");
            err.status = 410; // 410 c'est "Gone" jtrouve ça plus précis que 404
            throw err;
        }

        return share;
    },

    shareFolderWithUser: async (folderId, targetEmail, ownerId) => {
        const targetUser = await authDao.findByEmail(targetEmail);
        if (!targetUser) {
            const err = new Error("Utilisateur destinataire introuvable sur SUPFile");
            err.status = 404;
            throw err;
        }

        if (targetUser.id === ownerId) {
            const err = new Error("Vous ne pouvez pas partager un dossier avec vous-même");
            err.status = 400;
            throw err;
        }

        const folder = await fileItemDao.findByIdAndOwner(folderId, ownerId);
        if (!folder || !folder.is_folder) {
            const err = new Error("Dossier invalide ou permissions insuffisantes");
            err.status = 403;
            throw err;
        }

        await shareDao.createInternalShare(folderId, targetUser.id);

        return { email: targetUser.email };
    }
};

module.exports = shareService;