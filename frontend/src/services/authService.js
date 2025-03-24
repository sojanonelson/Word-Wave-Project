
import axios from 'axios';


const API_URL = process.env.REACT_APP_BACKEND_API;

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/user/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error logging in');
  }
};
export const createAccount = async (email, password, name, image) => {
  try {
    // Create FormData object
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('name', name);
    if (image) {
      formData.append('profileImage', image); // Append file object, not URL
    }

    const response = await axios.post(`${API_URL}/user/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file upload
      },
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creating account');
  }
};