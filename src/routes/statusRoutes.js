const express = require('express');
const { getStatus } = require('../controllers/statusController');
const router = express.Router();

router.get('/status/:requestId', getStatus);

module.exports = router;