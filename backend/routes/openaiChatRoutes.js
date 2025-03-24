
const express = require('express');
const { chatWithOpenAI } = require('../controllers/chatController');

const router = express.Router();

router.post('/generate', chatWithOpenAI);


module.exports = router;
