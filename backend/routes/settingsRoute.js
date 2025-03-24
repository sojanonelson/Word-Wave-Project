const { getUserSettings,updateUserSettings } = require('../controllers/settingsController');
const express = require('express');

const router = express.Router()



router.get('/', getUserSettings);
router.put('/:userId', updateUserSettings)

module.exports = router;