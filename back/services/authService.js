const authDao = require('../dao/authDao');
const authUtils = require('../utils/authUtils');

const authService = {
    register: async (email, password) => {
        const existingUser = await authDao.findByEmail(email);
        if (existingUser) {
            const err = new Error('Cet email est déjà utilisé.');
            err.status = 409;
            throw err;
        }

        const hashedPassword = await authUtils.hashPassword(password);
        const newUser = await authDao.create(email, hashedPassword);

        // token des l'inscription pour se co automatiquement
        const token = authUtils.generateToken(newUser);

        return {
            token,
            user: { id: newUser.id, email: newUser.email }
        };
    },

    login: async (email, password) => {
        const user = await authDao.findByEmail(email);
        if (!user || !user.password_hash) {
            const err = new Error('Identifiants invalides.');
            err.status = 401;
            throw err;
        }

        const isMatch = await authUtils.comparePassword(password, user.password_hash);
        if (!isMatch) {
            const err = new Error('Identifiants invalides.');
            err.status = 401;
            throw err;
        }
        return { id: user.id, email: user.email };
    },

    updatePassword: async (userId, currentPassword, newPassword) => {
        const user = await authDao.findById(userId);
        if (!user) {
            const err = new Error("Utilisateur introuvable");
            err.status = 404;
            throw err;
        }

        const isMatch = await authUtils.comparePassword(currentPassword, user.password_hash);
        if (!isMatch) {
            const err = new Error("Ancien mot de passe incorrect");
            err.status = 400;
            throw err;
        }

        const hashedPassword = await authUtils.hashPassword(newPassword);
        return await authDao.updatePassword(userId, hashedPassword);
    },
    findOrCreateOAuthUser: async (profile) => {
        const email = profile.emails[0].value;
        let user = await authDao.findByEmail(email);

        if (user) {
            return user;
        }

        user = await authDao.create(email, null);
        return user;
    },
    findUserById: async (id) => {
        const user = await authDao.findById(id);
        if (!user) {
            const err = new Error("Utilisateur introuvable");
            err.status = 404;
            throw err;
        }
        return user;
    },
};

module.exports = authService;