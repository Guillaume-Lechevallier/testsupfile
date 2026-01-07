const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/upload', authMiddleware, upload.single('file'), fileController.upload);
router.get('/', authMiddleware, fileController.getFiles);
router.get('/:id/download', authMiddleware, fileController.download);
router.get('/:id/download-folder', authMiddleware, fileController.downloadFolder);
router.get('/stats', authMiddleware, fileController.getStats);
router.delete('/:id', authMiddleware, fileController.delete);
router.delete('/:id/hard', authMiddleware, fileController.forceDelete);
router.get('/trash', authMiddleware, fileController.getTrash);
router.post('/folder', authMiddleware, fileController.createFolder);
router.patch('/:id/rename', authMiddleware, fileController.rename);
router.patch('/:id/restore', authMiddleware, fileController.restore);

module.exports = router;