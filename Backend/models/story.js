const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  slides: [
    {
      slideNumber: {
        type: Number,
        required: true,
      },
      heading: {
        type: String,
        required: true,
      },
      description: {
        type: String, 
      },
      url: {
        type: String,
        required: true, 
      },
      category: {
        type: String,
        required: true,
        enum: ["Food", "Fashion", "Sports", "Travel", "Movie", "Education", "Business"], // Allowed categories
        
      },
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      likeCount: {
        type: Number,
        default: 0, 
      },
      bookmarks: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", 
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  updatedAt: {
    type: Date,
    default: Date.now, 
  },
});

const Story = mongoose.model("Story", storySchema);
module.exports = Story;