const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', upload.single('profileImage'), userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/info/:userId', userController.getUserData);


module.exports = router;
