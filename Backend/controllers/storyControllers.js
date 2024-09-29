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

//   Update a Story
const updateStory = async (req, res) => {
  const { storyId } = req.params;
  const { slides } = req.body;

  console.log("Story ID:", storyId);  // Log the story ID
  console.log("Slides to update:", slides);  // Log the incoming slides

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

const likedslides = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id; // Assuming user authentication middleware sets this

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Find which slides are liked by the user
    const likedSlides = story.slides
      .filter((slide) => slide.likes.includes(userId))
      .map((slide) => slide.slideNumber); // Get slide numbers the user liked

    res.status(200).json(likedSlides);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const toggleBookmarkSlide = async (req, res) => {
  const { storyId, slideNumber } = req.params;
  const userId = req.user._id; // Extract userId from req.user (set by authMiddleware)

  try {
    const story = await Story.findOne({
      _id: storyId,
      "slides.slideNumber": slideNumber,
    });

    if (!story) {
      return res.status(404).json({ message: "Story or slide not found" });
    }

    const slide = story.slides.find(
      (slide) => slide.slideNumber === parseInt(slideNumber)
    );

    const userIndex = slide.bookmarks.indexOf(userId);

    if (userIndex !== -1) {
      // If user has already bookmarked, remove bookmark
      slide.bookmarks.splice(userIndex, 1);
      await story.save();
      return res.status(200).json({ message: "Slide unbookmarked successfully", story });
    } else {
      // If user hasn't bookmarked, add bookmark
      slide.bookmarks.push(userId);
      await story.save();
      return res.status(200).json({ message: "Slide bookmarked successfully", story });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller to fetch user bookmarked slides
const fetchUserBookmarkedSlides = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user._id; // Assuming authMiddleware sets req.user

  try {
    // Find the user and filter bookmarked slides based on storyId
    const user = await User.findById(userId).select('bookmarkedSlides');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter bookmarked slides for the specific story
    const bookmarkedSlides = user.bookmarkedSlides
      .filter(bookmark => bookmark.storyId.toString() === storyId)
      .map(bookmark => bookmark.slideNumber);

    return res.status(200).json(bookmarkedSlides); // Return bookmarked slide numbers
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {
  createStory,
  getAllStories,
  getStory,
  likeSlide,
  updateStory,
  deleteStory,
  filterStoriesByCategory,
  getStoriesByUsername,
  likedslides,
  toggleBookmarkSlide,
  fetchUserBookmarkedSlides
};
