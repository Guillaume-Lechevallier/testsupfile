const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Le dossier qu'on a créé dans la racine de ./backend
    },
    filename: (req, file, cb) => {
        // On génère un nom unique pour éviter les doublons : timestamp-nom-original
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;