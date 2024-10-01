const Story = require("../models/story");
const User = require("../models/user");

// Create a new story
const createStory = async (req, res) => {
  try {
    const { slides } = req.body;
    const author = req.user._id;

    if (!slides || slides.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one slide is required" });
    }

    const lastSlideCategory = slides[slides.length - 1].category;

    const updatedSlides = slides.map((slide, index) => ({
      ...slide,
      category: lastSlideCategory,
      slideNumber: index + 1,
    }));

    const story = new Story({
      author,
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
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const stories = await Story.find({ author: user._id }).populate(
      "author",
      "username"
    );

    if (!stories.length) {
      return res
        .status(404)
        .json({ message: "No stories found for this user" });
    }

    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Filter stories by category
const filterStoriesByCategory = async (req, res) => {
  const { category } = req.params;

  try {
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
    const stories = await Story.find().populate({
      path: "author",
      select: "username",
    });

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
  const userId = req.user._id;

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

    const userIndex = slide.likes.indexOf(userId);

    if (userIndex !== -1) {
      slide.likes.splice(userIndex, 1);
      slide.likeCount -= 1; //
      await story.save();
      return res
        .status(200)
        .json({ message: "Slide unliked successfully", story });
    } else {
      slide.likes.push(userId);
      slide.likeCount += 1;
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

  console.log("Story ID:", storyId);
  console.log("Slides to update:", slides);

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
    const userId = req.user._id;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const likedSlides = story.slides
      .filter((slide) => slide.likes.includes(userId))
      .map((slide) => slide.slideNumber);

    res.status(200).json(likedSlides);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const toggleBookmarkSlide = async (req, res) => {
  try {
    const { storyId, slideNumber } = req.params;
    const userId = req.user._id;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const slide = story.slides.find(
      (slide) => slide.slideNumber === parseInt(slideNumber)
    );

    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookmarked = slide.bookmarks.includes(userId);

    if (isBookmarked) {
      slide.bookmarks = slide.bookmarks.filter(
        (bookmark) => bookmark.toString() !== userId.toString()
      );

      user.bookmarkedSlides = user.bookmarkedSlides.filter(
        (bookmark) =>
          !(
            bookmark.storyId.toString() === storyId &&
            bookmark.slideNumber === parseInt(slideNumber)
          )
      );
    } else {
      slide.bookmarks.push(userId);

      user.bookmarkedSlides.push({
        storyId,
        slideNumber: parseInt(slideNumber),
      });
    }

    await story.save();
    await user.save();

    return res.json({
      message: isBookmarked ? "Bookmark removed" : "Bookmark added",
      isBookmarked: !isBookmarked,
    });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller to fetch user bookmarked slides
const fetchUserBookmarkedSlides = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const bookmarkedSlides = story.slides
      .filter((slide) => slide.bookmarks.includes(userId))
      .map((slide) => slide.slideNumber);

    return res.json({ bookmarkedSlides });
  } catch (error) {
    console.error("Error fetching bookmarked slides:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getBookmarkedStories = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate(
      "bookmarkedSlides.storyId"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.bookmarkedSlides || user.bookmarkedSlides.length === 0) {
      return res.status(200).json({ message: "No bookmarked stories" });
    }

    const bookmarkedStories = await Promise.all(
      user.bookmarkedSlides.map(async (bookmark) => {
        const story = await Story.findById(bookmark.storyId);
        if (story) {
          return {
            storyId: story._id,
            title: story.title || "Untitled Story",
            slides: story.slides,
            bookmarkedSlideNumber: bookmark.slideNumber,
          };
        }
        return null;
      })
    );

    const filteredStories = bookmarkedStories.filter((story) => story !== null);

    res.status(200).json(filteredStories);
  } catch (error) {
    console.error("Error fetching bookmarked stories:", error);
    res.status(500).json({ message: "Error fetching bookmarked stories" });
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
  fetchUserBookmarkedSlides,
  getBookmarkedStories,
};
