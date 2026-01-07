
require('dotenv').config(); 
require('./utils/passportConfig'); 

const express = require('express');
const session = require('express-session');
const cors = require('cors'); 
const helmet = require('helmet');
const sanitizeMiddleware = require('./middlewares/sanitizeMiddleware');
const passport = require('passport');     
const pool = require('./db/db');
const errorHandler = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const shareRoutes = require('./routes/shareRoutes');

const PORT = process.env.PORT || 8080; 
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const app = express();

app.use(helmet({
    contentSecurityPolicy: false, 
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    frameguard: false, // sinan il me sort l'erreur 'Refused to display 'http://localhost:8080/' 
    // in a frame because it set 'X-Frame-Options' to 'sameorigin' quand je preview un fichier dans la modal
}));

app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
}));

app.use(express.json());

app.use(sanitizeMiddleware); 

app.get('/', (req, res) => {
  res.status(200).send("1 2 test vous mrecevez");
});

app.use(session({
    secret: process.env.JWT_SECRET, 
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/share', shareRoutes);
app.use(errorHandler);

app.get('/test-db', async (req, res) => {
    try {

        const result = await pool.query('SELECT COUNT(*) FROM "User"'); 
        res.status(200).json({ 
            status: 'OK',
            message: 'ça marche fort',
            users_count: result.rows[0].count 
        });
    } catch (e) {
        console.error('Erreur sur /test-db:', e.message);
        res.status(500).json({ status: 'ERROR', message: 'la requête db a fail', error: e.message });
    }
});

app.listen(PORT, () => {
  console.log(`\n serv démarré sur ${PORT}`);
});
