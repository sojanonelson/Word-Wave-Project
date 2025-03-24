const User = require('../models/User');

// Controller to get user settings
const getUserSettings = async (req, res) => {
  try {
    const {userId} = req.body
    console.log("userID",userId)
    const user = await User.findById(userId); // Assuming userId is provided in the request
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { themeMode, notificationSoundUrl } = user;
    res.status(200).json({ themeMode, notificationSoundUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserSettings = async (req, res) => {
    const { themeMode, notificationSoundUrl,notificationsEnabled } = req.body;
    const { userId } = req.params;  // Get userId from request parameters
  
    try {
      // Find the user by userId from params
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update settings if provided in the request body
      if (themeMode) user.themeMode = themeMode;
      if (notificationsEnabled) user.notificationsEnabled = notificationsEnabled;
      if (notificationSoundUrl) user.notificationSoundUrl = notificationSoundUrl;
  
      await user.save();  // Save updated settings
  
      res.status(200).json({ message: 'Settings updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

module.exports = { getUserSettings, updateUserSettings };
