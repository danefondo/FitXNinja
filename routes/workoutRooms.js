const express = require('express');
const auth = require('../config/auth');

const router = express.Router();

const roomController = require('../controller/rooms');

router.post('/createNewRoom', roomController.createNewRoom);

router.post('/:roomId/swapVideoUrl', roomController.swapVideoUrl);

router.get('/:roomId', roomController.getRoom);


module.exports = router;

