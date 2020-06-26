let User = require('../models/user');
let WorkoutVideo = require('../models/workout');
const profileController = {

    async getUserData(req, res) {
        try {
            let user = await User.findById(req.params.userId).exec();
            if (!user) {
                return res.status(404).json({
                    errors: "User not found."
                });
            }
            let videoId = req.params.videoId;
            let inLibrary = false;
            let inFavorites = false;

            if (user.personal_library.includes(videoId)) {
                inLibrary = true;
              } 

            if (user.favorites.includes(videoId)) {
                inFavorites = true;
            }

            res.status(200).json({
                inLibrary,
                inFavorites
            });

        } catch(error) {
            console.log(error);
            res.status(500).json({
                errors: "An unknown error occurred"
            });
        }
    },

    async addRemoveFromFavorites(req, res) {
        try {

            let user = await User.findById(req.params.userId).exec();
            if (!user) {
                return res.status(404).json({
                    errors: "User not found."
                });
            }

            let video_id = req.params.videoId;
            console.log("viD", video_id);
            if (user.favorites.includes(video_id)) {
                user.favorites.pull(video_id);
            } else {
                user.favorites.push(video_id);
            }

            await user.save();

            res.status(200).json({
                user: user,
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                errors: "An unknown error occurred"
            });
        }
    },
 
    async addRemoveFromLibrary(req, res) {
        try {

            let user = await User.findById(req.params.userId).exec();
            if (!user) {
                return res.status(404).json({
                    errors: "User not found."
                });
            }

            let video_id = req.params.videoId;
            if (user.personal_library.includes(video_id)) {
                user.personal_library.pull(video_id);
            } else {
                user.personal_library.push(video_id);
            }

            await user.save();

            res.status(200).json({
                user: user,
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                errors: "An unknown error occurred"
            });
        }
    },

    async makeAdmin(req, res) {
        try {
            console.log("madeadmn", req.params.userId);
            let user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(404).json({
                    errors: "Users not found."
                });
            }

            user.admin = true;
            await user.save();

            res.status(200).json({
                user: user,
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                errors: "An unknown error occurred"
            });
        }
    },

    async withdrawAdmin(req, res) {
        try {
            console.log("made", req.params.userId);

            let user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(404).json({
                    errors: "Users not found."
                });
            }

            user.admin = false;
            await user.save();

            res.status(200).json({
                user: user,
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                errors: "An unknown error occurred"
            });
        }
    }

}

module.exports = profileController;
