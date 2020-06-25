const express = require('express');
const auth = require('../config/auth');

const router = express.Router();

const workoutController = require('../controller/workouts');

router.get('/:videoId', workoutController.showVideo);

router.delete('/:videoId/deleteVideo', auth.ensureAuthenticated, workoutController.deleteVideo);


module.exports = router;

