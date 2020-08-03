const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
let WorkoutRoom = require("../models/room");
let User = require("../models/user");
let tempHostUser = require("../models/tempUser");
const accountUtil = require("../utils/account");
const streamUtils = require("../utils/stream");
const moment = require("moment");
const OpenTok = require("opentok");
const auth = require("../config/auth");
const { Outposts } = require("aws-sdk");

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;

if (!apiKey || !apiSecret) {
  console.log("You must specify API_KEY and API_SECRET environment variables");
}

const OT = new OpenTok(apiKey, apiSecret);

const roomController = {
  async swapVideoUrl(req, res) {
    try {
      let room_id = req.params.roomId;
      console.log("EYYYYYY", room_id);
      let room = await WorkoutRoom.findById(room_id);
      if (!room) {
        return res.status(404).json({
          message: "Room not found",
        });
      }

      console.log("roomooo", room);
      //- THIS IS NEW YOUTUBE VIDEO URL
      console.log("bodyy", req.body);
      let video_url = req.body.swap_url;
      video_url = video_url.replace(/\s/g, "");
      console.log("uurllll", video_url);
      room.video_url = video_url;

      //- THIS HAS NO WORKOUT VIDEO, THUS SET WORKOUT VIDEO ID TO UNDEFINED
      room.video_id = undefined;

      //- THIS IS NEW YOUTUBE VIDEO ID
      let youtubeId = streamUtils.getYoutubeId(video_url);
      room.youtube_id = youtubeId;

      await room.save();
      console.log("whaaadddupp", youtubeId);
      res.status(200).json({
        room,
        youtubeId,
      });
    } catch (error) {
      res.status(500).json({
        errors: "An unknown error occurred",
      });
    }
  },

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
          dateCreated,
        });

        await hostUser.save();

        room.host_id = hostUser._id;

        tempUser = {
          _id: hostUser._id,
          room: associated_room_id,
          tempVerifTok: verificationToken,
        };
        tempToken = jwt.sign({ tempHost: tempUser }, process.env.SECRET, {
          expiresIn: "1d",
        });
      }

      //- THIS IS WORKOUT ID
      if (data.video_id) {
        room.video_id = data.video_id;
      }

      //- THIS IS YOUTUBE URL
      let video_url = data.video_url;
      video_url = video_url.replace(/ /g, "");
      room.video_url = video_url;

      //- THIS IS YOUTUBE VIDEO ID
      room.youtube_id = data.youtube_id;

      room.date_created = data.date_created;

      //- CREATE VONAGE SESSION
      OT.createSession({ mediaMode: "routed" }, async function (
        error,
        session
      ) {
        if (error) {
          console.log("Error creating session:", error);
        } else {
          // Store the session in the database
          console.log("sess", session);
          room.session_id = session.sessionId;
          console.log("sess2", session);
          console.log("room", room);
          await room.save();
          if (!temp) {
            res.status(200).json({
              room: room,
            });
          } else {
            res.status(200).json({
              room: room,
              tempHost: tempUser,
              tempToken: tempToken,
            });
          }
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        errors: "An unknown error occurred",
      });
    }
  },

  async getRoom(req, res) {
    try {
      let room_id = req.params.roomId;

      let room = await WorkoutRoom.findById(room_id);
      if (!room) {
        return res.status(404).json({
          message: "Room not found",
        });
      }

      let host_name = req.headers.host;

      // Configure token options
      const tokenOptions = {
        role: "publisher",
        data: `roomid=${room_id}`,
      };

      //- Since to get a room, a session already must exist, therefore no need to check for session, although for additional safety could be useful.
      let sessionId = room.session_id;
      // Generate token with the Vonage Video API Client SDK
	  let token = OT.generateToken(sessionId, tokenOptions);
	  console.log("token", token);

      room.session_tokens.push(token);
      await room.save();
      // Send the required credentials back to to the client
      res.status(200).json({
        room,
        host_name,
        apiKey,
        sessionId,
        token,
      });
    } catch (error) {
      res.status(500).json({
        errors: "An unknown error occurred",
      });
    }
  },
};

module.exports = roomController;
