const axios = require("axios");

const generateResponse = async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post("http://127.0.0.1:11434/api/generate", {
      model: "llama3.2",
      prompt: message,
      stream: false,
      saveHistory: true,
    });

    res.json({ response: response.data.response });
  } catch (error) {
    console.error("Error message:", error.message);
    if (error.response) {
      console.error("Response error:", error.response.data);
    }
  }
};

const TrainModel = async (req, res) => {
    const { message } = req.body;
  
    try {
      const response = await axios.post("http://localhost:11434/api/generate", {
        model: "llama3.2",
        prompt: message,
        stream: false,
      });
  
      res.json({ response: response.data.response });
    } catch (error) {
      console.error("Error message:", error.message);
      if (error.response) {
        console.error("Response error:", error.response.data);
      }
    }
  };

  const setHistory = async (req, res) => {
    const { history } = req.body;
  
    try {
      const response = await axios.post("http://localhost:11434/api/set-history", {
        model: "llama3.2",
        history,
      });
  
      res.json({ response: response.data });
    } catch (error) {
      console.error("Error setting history:", error.message);
    }
  };


module.exports= { generateResponse,TrainModel,setHistory };