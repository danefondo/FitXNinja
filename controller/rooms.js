const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
let WorkoutRoom = require('../models/room');
let User = require('../models/user');
let tempHostUser = require('../models/tempUser');
const accountUtil = require('../utils/account')
const streamUtils = require('../utils/stream')
const moment = require('moment');

const roomController = {

    async createNewRoom(req, res) {
        try {

            let data = req.body;

            let tempUser = {};
            let tempToken;
            let temp = false;

            let room = new WorkoutRoom();
            if (data.host_id) {
                room.host_id = data.host_id;
                // room.current_participants.push(data.host_id);
            } else {
                //- Create temporary user
                temp = true;
                const dateCreated = new Date();
                const associated_room_id = room._id;
                const verificationToken = await accountUtil.generateToken();
                console.log("veriftok: ", verificationToken);

                let hostUser = new tempHostUser({
                    associated_room_id,
                    verificationToken,
                    dateCreated
                });

                await hostUser.save();

                room.host_id = hostUser._id;

                tempUser = { _id: hostUser._id, room: associated_room_id, tempVerifTok: verificationToken }
                tempToken = jwt.sign({ tempHost: tempUser }, process.env.SECRET, {
                    expiresIn: '1d',
                });

            }

            if (data.video_id) {
                room.video_id = data.video_id;
            }
            
            room.video_url = data.video_url;
            room.youtube_id = data.youtube_id;
            room.date_created = data.date_created;
            
            await room.save();

            if (!temp) {
                res.status(200).json({
                    room: room
                })
            } else {
                res.status(200).json({
                    room: room,
                    tempHost: tempUser,
                    tempToken: tempToken
                })
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({
                errors: "An unknown error occurred"
            });
        }
    },

    async getRoom(req, res) {
        try {
            let room_id = req.params.roomId;

            let room = await WorkoutRoom.findById(room_id);
            if (!room) {
                return res.status(404).json({
                    message: "Room not found"
                });
            }

            let host_name = req.headers.host;

            res.status(200).json({
                room: room,
                host_name: host_name
            });
        } catch (error) {
            res.status(500).json({
                errors: "An unknown error occurred"
            });
        }
    }

}

module.exports = roomController;
