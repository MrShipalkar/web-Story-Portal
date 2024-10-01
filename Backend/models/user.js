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
    slideNumber: { type: Number },  
    _id: false 
  }]
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
