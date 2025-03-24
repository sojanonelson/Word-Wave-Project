
const express = require('express');
const { generateResponse, TrainModel, setHistory } = require('../controllers/llamaController');

const router = express.Router();

router.post('/generate', generateResponse);
router.post('/train', TrainModel);
router.post('/history', setHistory);


module.exports = router;
