const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log("name backend:", name)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get image URL from Cloudinary middleware
    const image = req.file ? req.file.path : null;
    console.log("Image Url",image)

    const newUser = new User({ 
      email, 
      password: hashedPassword, 
      name,
      image 
    });

    await newUser.save();

    res.status(201).json("User created successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; // <-- Missing closing brace added here

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ userId: user._id, name: user.name, email: user.email, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("UserID", userId);
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
