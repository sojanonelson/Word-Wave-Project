import axios from 'axios';


const API_URL = process.env.REACT_APP_BACKEND_API;

export const  getRoomDetails = async (roomCode) => {
  try {
    const response = await axios.get(`${API_URL}/room/info/${roomCode}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error getting room details');
  }
};
