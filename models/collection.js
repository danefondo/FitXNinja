const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const Workout = require("./workout.js");

const collectionSchema = new mongoose.Schema({
  name: String,
  description: String,
  tags: [String],
  workouts: [{type: Schema.Types.ObjectId, ref: 'Workout'}],
  date_created: Date,
  creator_id: String,
  liked_by: [String],
  is_featured: Boolean,
  public_status: String,
});

const Collection = (module.exports = mongoose.model("Collection", collectionSchema));
