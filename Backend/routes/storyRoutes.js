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
  fetchUserBookmarkedSlides
} = require("../controllers/storyControllers");


// Story routes
router.post('/stories',auth, createStory);
router.get('/stories',getAllStories);
router.get('/stories/:storyId', getStory);
router.get('/stories/category/:category', filterStoriesByCategory);
router.get("/stories/user/:username",getStoriesByUsername);

router.get('/stories/:storyId/liked-slides',auth,likedslides);

router.get('/stories/:storyid/bookmarked-slides',auth, fetchUserBookmarkedSlides);
router.put('/stories/:storyId/slides/:slideNumber/like',auth,  likeSlide);
router.put('/stories/:storyId/slides/:slideNumber/bookmark',auth,  toggleBookmarkSlide);
router.put('/stories/:storyId',auth,  updateStory);
router.delete('/stories/:storyId',auth,  deleteStory);

module.exports = router;
