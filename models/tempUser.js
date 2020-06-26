const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const tempHostUserSchema = new mongoose.Schema({
    associated_room_id: String,
    verificationToken: String,
    dateCreated: Date
});

const tempHostUser = module.exports = mongoose.model('tempHostUser', tempHostUserSchema);