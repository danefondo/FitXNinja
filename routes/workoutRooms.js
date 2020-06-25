const express = require('express');
const auth = require('../config/auth');

const router = express.Router();

const roomController = require('../controller/rooms');

router.post('/createNewRoom', auth.ensureAuthenticated, roomController.createNewRoom);

router.get('/:roomId', roomController.getRoom);


module.exports = router;

