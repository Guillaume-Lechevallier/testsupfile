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

        res.redirect(`http://localhost:3000/auth-success?token=${token}`);

    }
);


router.get('/me', authenticateToken, authController.getCurrentUser);

router.put('/update-profile', authenticateToken, authController.updateProfile);

module.exports = router;