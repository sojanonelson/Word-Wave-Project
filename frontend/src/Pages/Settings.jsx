import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, Moon, ChevronRight, 
  LogOut, Settings as SettingsIcon,
  Play
} from 'lucide-react';

import Switch from '../components/general/switch';
import { getUserById } from '../services/userService';
import { updateSettings } from '../services/settingService';
import defaultImage from '../Data/profile.png'

const SettingsPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedSound, setSelectedSound] = useState('sound1');
  const [updateSound,setUpdateSound]= useState('')
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample notification sounds data
  const notificationSounds = [
    { id: 'sound1', name: 'sound1', url: 'https://res.cloudinary.com/dtmi06vru/video/upload/v1739252589/h3mur2tv5vli4ub64fau.wav' },
    { id: 'sound2', name: 'sound2', url: 'https://res.cloudinary.com/dtmi06vru/video/upload/v1739252589/godceeuxpvngu7q1qrsl.wav' },

  ];

  // Function to play sound preview
  const playSound = (soundUrl) => {
    const audio = new Audio(soundUrl);
    audio.play().catch(error => console.error("Error playing sound:", error));
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const userID = localStorage.getItem("userID");
      if (userID) {
        try {
          const data = await getUserById(userID);
          
          setIsDarkMode(data.themeMode);
          setNotificationsEnabled(data.notificationsEnabled);
          
          // Use setItem to save the notificationSoundUrl to localStorage
          localStorage.setItem('notificationSound', data.notificationSoundUrl);
          
          // Check if selectedSound is available, otherwise default to 'sound1'
          setSelectedSound(data.selectedSound || 'sound1');
          
          setUserData(data);
          setLoading(false);
          
          console.log("SOUND", data.notificationSoundUrl); // Just for debugging
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      }
    };
  
    fetchUserData();
  }, []);
  

  const handleUpdateSettings = async () => {
    const updatedSettings = {
      themeMode: isDarkMode,
      notificationsEnabled: notificationsEnabled,
      notificationSoundUrl: updateSound
    };

    try {
      const result = await updateSettings(updatedSettings);
      if (result) {
        console.log("Settings updated successfully", result);
      }
    } catch (error) {
      console.error("Error updating settings", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  console.log("user", userData.name)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Profile Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='profile py-10 flex justify-center flex-col items-center'
      >
        <img 
          src={userData?.image || defaultImage } 
          alt="Profile"
          className='rounded-full object-cover w-[150px] h-[150px] border-4 border-blue-500'
        />
        <p className='text-xl font-semibold mt-4'>{userData?.name}</p>
        <p className='text-sm text-gray-600'>{userData?.email}</p>
      </motion.div>

      <hr className='mx-20 border-t-2 border-gray-200' />

      {/* Settings Sections */}
      <div className='settings px-6 py-8 flex flex-col justify-center items-center space-y-6'>
        {/* Appearance Settings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 rounded-lg p-4 w-3/5"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Moon className="mr-3 text-blue-600" />
            Appearance
          </h3>
          <div className="flex justify-between items-center">
            <span>Dark Mode</span>
            <Switch
              checked={isDarkMode}
              onCheckedChange={(checked) => setIsDarkMode(checked)}
            />
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-50 rounded-lg p-4 w-3/5"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Bell className="mr-3 text-blue-600" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Enable Notifications</span>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={(checked) => setNotificationsEnabled(checked)}
              />
            </div>
            {notificationsEnabled && (
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Notification Sound</label>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedSound}
                    onChange={(e) => setSelectedSound(e.target.value)}
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {notificationSounds.map((sound) => (
                      <option key={sound.id} value={sound.id}>
                        {sound.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      const sound = notificationSounds.find(s => s.id === selectedSound);
                      if (sound){
                        setUpdateSound(sound.url)
                        playSound(sound.url);
                      } 
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Play className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 rounded-lg w-3/5"
        >
          <h3 className="text-lg font-semibold p-4 flex items-center">
            <SettingsIcon className="mr-3 text-blue-600" />
            Account
          </h3>
          <div>
            <button className="w-full text-left p-4 hover:bg-gray-100 flex justify-between items-center">
              <span>Edit Profile</span>
              <ChevronRight className="text-gray-400" />
            </button>
            <hr className="border-t border-gray-200" />
            <button className="w-full text-left p-4 text-red-600 hover:bg-gray-100 flex justify-between items-center">
              <span>Logout</span>
              <LogOut className="text-red-600" />
            </button>
          </div>
        </motion.div>

        {/* Save Changes Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-3/5 mt-6"
        >
          <button
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={handleUpdateSettings}
          >
            Save Changes
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;