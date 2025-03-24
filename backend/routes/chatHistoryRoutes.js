const express = require('express');
const {saveMessages} = require('../controllers/chatHistory')
const router = express.Router();


router.post('/saveChatHistory', saveMessages);

module.exports = router;
