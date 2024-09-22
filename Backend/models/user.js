const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bookmarkedSlides: [{
    storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
    slideNumber: { type: Number },  // Assuming you use slideNumber as a unique identifier within a story
    _id: false // Prevent mongoose from creating a separate _id for this subdocument
  }]
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
