const Story = require("../models/story");
const User = require("../models/user");

// Create a new story
const createStory = async (req, res) => {
  try {
    const { slides } = req.body;
    const author = req.user._id; // Get the author from the authenticated user

    if (!slides || slides.length === 0) {
      return res.status(400).json({ message: "At least one slide is required" });
    }

    const lastSlideCategory = slides[slides.length - 1].category;

    const updatedSlides = slides.map((slide, index) => ({
      ...slide,
      category: lastSlideCategory,
      slideNumber: index + 1,
    }));

    const story = new Story({
      author,  // Use the author from the middleware
      slides: updatedSlides,
    });

    await story.save();

    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Stories by User (Author)
const getStoriesByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find all stories authored by this user
    const stories = await Story.find({ author: user._id }).populate('author', 'username');

    // If no stories found, send a 404
    if (!stories.length) {
      return res.status(404).json({ message: 'No stories found for this user' });
    }

    res.status(200).json(stories); // Return the user's stories
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Filter stories by category
const filterStoriesByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    // Find stories where at least one slide has the given category
    const stories = await Story.find({ "slides.category": category }).populate(
      "author",
      "username"
    );

    if (stories.length === 0) {
      return res
        .status(404)
        .json({ message: `No stories found for category: ${category}` });
    }

    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Stories
const getAllStories = async (req, res) => {
  try {
    // Fetch all stories and populate the author field with the username
    const stories = await Story.find().populate({
      path: "author",
      select: "username", // Only fetch the username field of the author
    });

    // Send the stories in the response
    res.status(200).json(stories);
  } catch (error) {
    // Handle server errors
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
  const userId = req.user._id; // Extract userId from req.user (set by authMiddleware)

  try {
    // Find the story by ID and slideNumber
    const story = await Story.findOne({
      _id: storyId,
      "slides.slideNumber": slideNumber,
    });

    if (!story) {
      return res.status(404).json({ message: "Story or slide not found" });
    }

    // Find the specific slide that the user wants to like/unlike
    const slide = story.slides.find(
      (slide) => slide.slideNumber === parseInt(slideNumber)
    );

    // Check if the user has already liked this slide
    const userIndex = slide.likes.indexOf(userId);

    if (userIndex !== -1) {
      // If user has already liked the slide, remove the like (unlike)
      slide.likes.splice(userIndex, 1); // Remove user from likes array
      slide.likeCount -= 1; // Decrement the like count
      await story.save();
      return res
        .status(200)
        .json({ message: "Slide unliked successfully", story });
    } else {
      // If user hasn't liked the slide, add the like
      slide.likes.push(userId); // Add user to likes array
      slide.likeCount += 1; // Increment the like count
      await story.save();
      return res
        .status(200)
        .json({ message: "Slide liked successfully", story });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const bookmarkSlide = async (req, res) => {
  const { storyId, slideNumber } = req.params;
  const userId = req.user._id; // Get userId from req.user (set by authMiddleware)

  try {
    // Find the story by ID
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Find the specific slide by slideNumber in the slides array
    const slide = story.slides.find(
      (s) => s.slideNumber === parseInt(slideNumber)
    );
    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has already bookmarked this slide in the story
    const slideBookmarked = slide.bookmarks.includes(userId);

    // Check if the user has already bookmarked this slide in the user schema
    const alreadyBookmarked = user.bookmarkedSlides.some(
      (bookmark) =>
        bookmark.storyId.equals(storyId) &&
        bookmark.slideNumber === parseInt(slideNumber)
    );

    if (slideBookmarked && alreadyBookmarked) {
      // If user has already bookmarked, unbookmark the slide
      slide.bookmarks = slide.bookmarks.filter(
        (id) => id.toString() !== userId.toString()
      );
      user.bookmarkedSlides = user.bookmarkedSlides.filter(
        (bookmark) =>
          !(bookmark.storyId.equals(storyId) && bookmark.slideNumber === parseInt(slideNumber))
      );

      await story.save();
      await user.save();
      return res
        .status(200)
        .json({ message: "Slide unbookmarked successfully", story, user });
    } else {
      // If not already bookmarked, add to bookmarks
      if (!slideBookmarked) {
        slide.bookmarks.push(userId); // Add userId to the bookmarks
      }

      if (!alreadyBookmarked) {
        user.bookmarkedSlides.push({ storyId, slideNumber }); // Add storyId and slideNumber to user's bookmarks
      }

      // Save both the story and user updates
      await story.save();
      await user.save();

      return res
        .status(200)
        .json({ message: "Slide bookmarked successfully", story, user });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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

module.exports = {
  createStory,
  getAllStories,
  getStory,
  likeSlide,
  bookmarkSlide,
  updateStory,
  deleteStory,
  filterStoriesByCategory,
  getStoriesByUsername
};
