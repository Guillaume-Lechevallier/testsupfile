const authService = require('../services/authService');
const authUtils = require('../utils/authUtils');

const authController = {
    register: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const data = await authService.register(email, password);
            
            res.status(201).json(data);  // data contiendra les infos du user et le token pour se co direct apres linscription
        } catch (error) {
            next(error);
        }
    },

    login: async (req, res, next) => { 
        try {
            const { email, password } = req.body;
            const user = await authService.login(email, password);
            const token = authUtils.generateToken(user);

            res.status(200).json({
                message: 'Connexion réussie.',
                token,
                user: { id: user.id, email: user.email }
            });
        } catch (error) {
            next(error); 
        }
    },

    getCurrentUser: async (req, res, next) => { 
        try {
            const user = await authService.findUserById(req.user.id);
            if (!user) {
                // obligé de creer l'error manuellement ici pour quelle puisse etre catch par le middleware d'errorhandler
                const err = new Error("Utilisateur non trouvé");
                err.status = 404;
                throw err;
            }
            res.json({ id: user.id, email: user.email });
        } catch (error) {
            next(error);
        }
    },

    updateProfile: async (req, res, next) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id;

            await authService.updatePassword(userId, currentPassword, newPassword);
            res.status(200).json({ message: "Mot de passe mis à jour avec succès !" });
        } catch (error) {
            next(error);
        }
    },

    generateTokenFromPassport: (user) => {
        return authUtils.generateToken(user);
    },
};

module.exports = authController;