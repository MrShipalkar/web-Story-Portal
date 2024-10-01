const express = require("express");
const router = express.Router();
const auth =  require('../middleware/auth')
const {
  createStory,
  getAllStories,
  getStory,
  likeSlide,
  bookmarkSlide,
  updateStory,
  deleteStory,
  filterStoriesByCategory,
  getStoriesByUsername,
  likedslides,
  toggleBookmarkSlide,
  fetchUserBookmarkedSlides,
  getBookmarkedStories
} = require("../controllers/storyControllers");


// Story routes
router.post('/stories',auth, createStory); //used
router.get('/stories/:storyId', getStory); //used
router.get('/stories/category/:category', filterStoriesByCategory); //used
router.get("/stories/user/:username",getStoriesByUsername); // used
router.get('/stories/:storyId/liked-slides',auth,likedslides); //used
router.get('/bookmarked-stories', auth, getBookmarkedStories); // used
router.get('/stories/:storyId/bookmarked-slides',auth, fetchUserBookmarkedSlides); // used
router.put('/stories/:storyId/slides/:slideNumber/like',auth,  likeSlide); //used
router.put('/stories/:storyId/slides/:slideNumber/bookmark',auth,  toggleBookmarkSlide); // used
router.put('/stories/:storyId',auth,  updateStory); // used
// router.delete('/stories/:storyId',auth,  deleteStory);
// router.get('/stories',getAllStories);

module.exports = router;
