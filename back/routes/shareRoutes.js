const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/internal', authMiddleware, shareController.shareInternal);

router.post('/public/:fileId', authMiddleware, shareController.createPublicLink);

router.get('/public/:token', shareController.accessShare);


module.exports = router;