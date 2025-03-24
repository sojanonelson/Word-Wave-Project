const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// router.post('/create', roomController.createRoom);
// router.post('/join', roomController.joinRoom);
// router.delete('/delete', roomController.deleteRoom);
router.get('/info/:roomcode', roomController.getRoomDetails); // Ensure getRoomInfo is defined in the controller
router.get('/check/:roomcode/:userID', roomController.checkUserIn); // Ensure checkUserIn is defined in the controller
// router.delete('/remove-member', roomController.removeUserFromRoom);

module.exports = router;
