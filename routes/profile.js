const express = require('express');
const auth = require('../config/auth')

const router = express.Router();

const streamController = require('../controller/stream');
const profileController = require('../controller/profile')

router.get('/user/:userId', auth.checkAuthenticated, streamController.getStreamer);

router.get('/:userId/getUserData/:videoId', auth.checkAuthenticated, profileController.getUserData);

router.post('/:userId/addRemoveFromFavorites/:videoId', auth.checkAuthenticated, profileController.addRemoveFromFavorites)

router.post('/:userId/addRemoveFromLibrary/:videoId', auth.checkAuthenticated, profileController.addRemoveFromLibrary)



module.exports = router;