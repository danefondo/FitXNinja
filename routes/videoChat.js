const express = require("express");
const OpenTok = require("opentok");
const auth = require("../config/auth");
const { Outposts } = require("aws-sdk");

const router = express.Router();
var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;

if (!apiKey || !apiSecret) {
  console.log("You must specify API_KEY and API_SECRET environment variables");
}
const OT = new OpenTok(apiKey, apiSecret);

let sessions = {};

router.post("/token", (req, res) => {
  //Generate a basic session. Or you could use an existing session ID.
  // token = OT.generateToken(req.body.sessionId);
  // console.log("token", token);
  // OT.createSession(function(error, session) {
  //     if (error) {
  //         console.log("Error creating session:", error)
  //     } else {
  //         sessionId = session.sessionId;
  //         console.log("Session ID: " + sessionId);
  //         const token = OT.generateToken(sessionId);
  //         console.log(token, sessionId)
  //         res.status(200).json({
  //             token,
  //             sessionId
  //         })
  //     }
  // });

  // const sessionId = req.body.sessionId;
  // const token = OT.generateToken(sessionId);
  // res.status(200).json({
  //     token,
  //     sessionId
  // })
  const roomId = req.body.roomId;
  if (sessions[roomId]) {
    // Generate the token
    console.log("Yo. I'm here.");
    generateToken(roomId, res);
  } else {
    console.log("Yo. I'm here actually.");
    // If the session does not exist, create one
    OT.createSession({mediaMode:"routed"}, function(error, session) {
      if (error) {
        console.log("Error creating session:", error);
      } else {
        // Store the session in the sessions object
        sessions[roomId] = session.sessionId;
        console.log("Now I'm here.", sessions);
        // Generate the token
        generateToken(roomId, res);
      }
    });
  }

//   let sessionId;
//   OT.createSession(function (error, session) {
//     if (error) {
//       console.log("Error creating session:", error);
//     } else {
//       sessionId = session.sessionId;
//       console.log("Session ID: " + sessionId);
//       let token = OT.generateToken(sessionId);
//       console.log("token: " + token);
//       res.status(200).json({
//         token,
//         sessionId,
//         apiKey,
//       });
//     }
//   });
});

function generateToken(roomId, res) {
console.log("Hi. I'm here.", sessions);
  // Configure token options
  const tokenOptions = {
    //role: "publisher",
    data: `roomid=${roomId}`,
  };
  // Generate token with the Video API Client SDK
  let token = OT.generateToken(sessions[roomId],tokenOptions);
//   let token = OT.generateToken(sessions[roomId], tokenOptions);
  // Send the required credentials back to to the client
  // as a response from the fetch request
  console.log("I'm here token.", token);
  res.status(200).json({
    sessionId: sessions[roomId],
    token,
    apiKey
  });
}

module.exports = router;

// create a new field in video table
// when a video is created, use OT.createSession to get the OT session id and save it
// when users are connecting to the video, make the /token api call like we do already and send the sessionId
// on the frontend use the token to connect to the session
