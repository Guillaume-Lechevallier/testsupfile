const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login-failed' }),
    (req, res) => {

        const token = authController.generateTokenFromPassport(req.user);
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

        res.redirect(`${clientUrl}/auth-success?token=${token}`);

    }
);


router.get('/me', authenticateToken, authController.getCurrentUser);

router.put('/update-profile', authenticateToken, authController.updateProfile);

module.exports = router;
