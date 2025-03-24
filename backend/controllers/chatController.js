// backend/controllers/chatController.js
const axios = require('axios');
require('dotenv').config();

// Function to handle the chat request to OpenAI API
const chatWithOpenAI = async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Request to OpenAI API
    const response = await axios.post(
      'http://localhost:3040/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // Updated model
        messages: [{ role: 'user', content: userMessage }], // Correct format
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const botMessage = response.data.choices[0].message.content.trim();
    return res.json({ reply: botMessage });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    return res.status(500).json({ error: 'Failed to communicate with OpenAI API' });
  }
};

module.exports = { chatWithOpenAI };
