// backend/routes/chatRoutes.js
const express = require('express');
const { chatWithOpenAI } = require('../controllers/chatController');

const router = express.Router();

// POST request to chat with OpenAI
router.post('/generate', chatWithOpenAI);


module.exports = router;
