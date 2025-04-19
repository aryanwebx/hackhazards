const express = require('express');
const router = express.Router();
const { moderateText } = require('../controllers/textController');

router.post('/', moderateText);
module.exports = router;
