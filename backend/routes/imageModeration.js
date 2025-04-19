const express = require('express');
const multer = require('multer');
const router = express.Router();
const { moderateImage } = require('../controllers/imageController'); // Correct destructure

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), moderateImage); // Passing function (not calling)

module.exports = router;
