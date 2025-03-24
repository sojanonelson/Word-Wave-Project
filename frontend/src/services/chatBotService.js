import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_API;

// Function to get Llama response
export const getllamaResponse = async (message) => {
  console.log("llama Here")
  try {

    const response = await axios.post(`${API_URL}/llama/generate`, { message });
    console.log("Llama RESPONSE:", response.data);
    return response.data;
  } catch (error) {
    // Handle error gracefully
    const errorMessage = error.response?.data?.message || 'Error getting response from Llama';
    throw new Error(errorMessage);
  }
};

// Function to get ChatGPT response
export const chatgptResponse = async (message) => {
  try {
    const response = await axios.post(`${API_URL}chatgpt/generate`, { message });  
    return response.data;
  } catch (error) {
    // Handle error gracefully
    const errorMessage = error.response?.data?.message || 'Error getting response from ChatGPT';
    throw new Error(errorMessage);
  }
};
