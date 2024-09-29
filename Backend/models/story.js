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
        type: String, // Optional description for each slide
      },
      url: {
        type: String,
        required: true, // URL for the slide content, could be an image or video
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
        default: 0, // Counter for likes, no array of user IDs needed
      },
      bookmarks: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Array of user IDs who have bookmarked this slide
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the date when the story is created
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically update the date when the story is modified
  },
});

const Story = mongoose.model("Story", storySchema);
module.exports = Story;