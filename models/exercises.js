const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const ExerciseSchema = new mongoose.Schema({
    name: String,
    description: String,
	muscle_group: [String],
    workout_type: [String],
    workout_goal: [String],
    sport: String,
    level: String,
    equipment: [String],
    location: String,
    sex: String,
    style_specification: [String],
    other_specification: [String],
    teacher_name: [String],
    organization: [String],
    liked_by: [String],
    dateAdded: Date,
    dateCreated: Date,
    video_URL: String,
    local_video_URL: String,
    instructional_video_url: String,
    custom_thumbnail: String,
    creator_image: String,
    creator_description: String,
    creator_website: String,
    creator_fb: String,
    creator_ig: String,
    creator_yt: String,
    creator_account_id: String,
    currently_doing_workout: [String],
    by_celebrity: Boolean
});

const Exercise = module.exports = mongoose.model('Exercise', ExerciseSchema);