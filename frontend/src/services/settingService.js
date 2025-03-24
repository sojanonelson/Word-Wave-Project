import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_API;

export const getSettings = () => {
  const userId = localStorage.getItem("userID");
  try {
    const response = axios.get(`${API_URL}/settings`, { userId: userId });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const updateSettings = async (newSettings) => {
    console.log("Set:", newSettings)
  const userId = localStorage.getItem("userID");
 
  

  try {
    const response = await axios.put(
      `${API_URL}/settings/${userId}`,
      newSettings // Assuming newSettings contains the new themeMode and notificationSoundUrl
    );
    return response.data; // Return the updated settings or any response from the server
  } catch (err) {
    console.error("Error updating settings:", err);
  }
};
