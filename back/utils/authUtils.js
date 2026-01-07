const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET; 

const hashPassword = async (password) => {
    if (!password) throw new Error("Le mot de passe est manquant.");
    return bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' }); 
};

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
};