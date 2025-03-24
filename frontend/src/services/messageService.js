import axios from 'axios';


const API_URL = process.env.REACT_APP_BACKEND_APIL;




  
  // Function to save chat history
  export const saveChatHistory = async (roomCode, memeberMessages, aiMessages) => {
    try {
      const response = await axios.post(`${API_URL}/chatHistory/saveChatHistory`, {
        roomCode: roomCode,
        memberMessages: memeberMessages,
        aiMessages: aiMessages
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error saving chat history');
    }
  };