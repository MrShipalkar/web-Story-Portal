const Story = require("../models/story");
const User = require('../models/user')

// Create a new story
const createStory = async (req, res) => {
  const { author, slides } = req.body;

  try {
    const story = new Story({
      author,
      slides,
    });
    await story.save();
    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Stories
const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().populate("author", "username");
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a Single Story
const getStory = async (req, res) => {
  const { storyId } = req.params;

  try {
    const story = await Story.findById(storyId).populate("author", "username");
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.status(200).json(story);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//   Like a Slide
const likeSlide = async (req, res) => {
  const { storyId, slideNumber } = req.params;
  const { userId } = req.body; // Assuming the user ID is passed in the request body

  try {
    const story = await Story.findOneAndUpdate(
      { _id: storyId, "slides.slideNumber": slideNumber },
      { $inc: { "slides.$.likeCount": 1 } }, // Increment the like count
      { new: true }
    );

    if (!story) {
      return res.status(404).json({ message: "Story or slide not found" });
    }

    res.status(200).json({ message: "Slide liked successfully", story });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//   Bookmark a Slide
const bookmarkSlide = async (req, res) => {
    const { storyId, slideNumber } = req.params;
    const { userId } = req.body;
  
    try {
      // Find the story by ID
      const story = await Story.findById(storyId);
      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }
  
      // Find the specific slide by slideNumber in the slides array
      const slide = story.slides.find(s => s.slideNumber === parseInt(slideNumber));
      if (!slide) {
        return res.status(404).json({ message: 'Slide not found' });
      }
  
      // Check if the user has already bookmarked the slide in the story
      if (!slide.bookmarks.includes(userId)) {
        slide.bookmarks.push(userId);  // Add userId to the bookmarks
      }
  
      // Find the user and add the bookmark to their user schema
      const user = await User.findById(userId);
      const alreadyBookmarked = user.bookmarkedSlides.some(
        bookmark => bookmark.storyId.equals(storyId) && bookmark.slideNumber === parseInt(slideNumber)
      );
  
      if (!alreadyBookmarked) {
        user.bookmarkedSlides.push({ storyId, slideNumber });  // Add storyId and slideNumber to user's bookmarks
      }
  
      // Save both the story and user updates
      await story.save();
      await user.save();
  
      res.status(200).json({ message: 'Slide bookmarked successfully', story, user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

//   Update a Story
const updateStory = async (req, res) => {
  const { storyId } = req.params;
  const { slides } = req.body;

  try {
    const story = await Story.findByIdAndUpdate(
      storyId,
      { slides },
      { new: true }
    );
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.status(200).json({ message: "Story updated successfully", story });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a Story
const deleteStory = async (req, res) => {
  const { storyId } = req.params;

  try {
    const story = await Story.findByIdAndDelete(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {createStory,getAllStories,getStory,likeSlide,bookmarkSlide,updateStory,deleteStory}