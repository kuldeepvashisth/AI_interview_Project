const express = require('express');
const router = express.Router();
const { uploadResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.post('/upload', protect, uploadResume);

module.exports = router;
