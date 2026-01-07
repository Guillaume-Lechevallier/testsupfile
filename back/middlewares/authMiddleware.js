const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    //Cherche dans les headers pour le token d'authentification ou dans les query params (pour le download des fichiers)
    const authHeader = req.headers['authorization'];
    const token = (authHeader && authHeader.split(' ')[1]) || req.query.token;

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token invalide.' });
    }
};

module.exports = authMiddleware;