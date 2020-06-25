const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const WorkoutVideoSchema = new mongoose.Schema({
    name: String,
    description: String,
	muscles: [String],
    types: [String],
    goals: [String],
    sports: [String],
    levels: [String],
    equipment: [String],
    duration: [String],
    music: String,
    songs: [String],
    styles: [String],
    specifications: [String],
    teachers: [String],
    organizations: [String],
    liked_by: [String],
    expected_results: [String],
    location: [String],
    dateAdded: Date,
    dateCreated: Date,
    url: String,
    video_id: String,
    creator_account_id: String,
    currently_doing_workout_count: Number,
    public_status: String
});

//- When adding teacher/organization, just add the id to the list here and later populate
//- Handle scenario when creator actually has a profile-account on our platform
//- Handle scenario if account-user is celebrity and also when verified, difference is mainly for also displaying by 'celebrity workouts'
//- Handle scenario to link creator to the platform
//- Handle LOCAL VIDEO UPLOADS through users of organizations

// video_URL: [{
//     type: String,
//     order_position: Number,
//     platform: String
// }],
// local_video_URL: [{
//     type: String,
//     order_position: Number,
//     platform: String
// }],

const WorkoutVideo = module.exports = mongoose.model('WorkoutVideo', WorkoutVideoSchema);