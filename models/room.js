const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const WorkoutRoomSchema = new mongoose.Schema({
    name: String,
    description: String,
    instructions: String,
    host_id: String,
    video_url: String,
    video_id: String,
    youtube_id: String,
    date_created: Date,
    date_ended: Date,
    location: String,
    current_participants: [String],
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
    expected_results: [String],
    public_status: String
});

//- When adding teacher/organization, just add the id to the list here and later populate
//- Handle scenario when creator actually has a profile-account on our platform
//- Handle scenario if account-user is celebrity and also when verified, difference is mainly for also displaying by 'celebrity workouts'
//- Handle scenario to link creator to the platform
//- Handle LOCAL VIDEO UPLOADS through users of organizations

const WorkoutRoom = module.exports = mongoose.model('WorkoutRoom', WorkoutRoomSchema);