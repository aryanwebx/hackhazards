const express = require('express');
const multer = require('multer');
const router = express.Router();
const { moderateAudio } = require('../controllers/audioController');

const upload = multer({ dest: 'uploads/' });
router.post('/', upload.single('audio'), moderateAudio);

module.exports = router;
