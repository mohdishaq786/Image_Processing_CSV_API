const express = require('express');
const { downloadCSV } = require('../controllers/downloadCSVController');
const router = express.Router();

router.get('/download/:requestId', downloadCSV);

module.exports = router;