const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String },
  themeMode: { type: Boolean, default: false }, 
  notificationsEnabled:{ type: Boolean, default: true },
  notificationSoundUrl: { type: String, default: 'https://res.cloudinary.com/dtmi06vru/video/upload/v1739252589/h3mur2tv5vli4ub64fau.wav' }, // URL for notification sound
});

const User = mongoose.model('User', userSchema);

module.exports = User;
