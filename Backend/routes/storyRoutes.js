const express = require("express");
const router = express.Router();
const {
  createStory,
  getAllStories,
  getStory,
  likeSlide,
  bookmarkSlide,
  updateStory,
  deleteStory,
  filterStoriesByCategory,
} = require("../controllers/storyControllers");


// Story routes
router.post('/stories',createStory);
router.get('/stories',getAllStories);
router.get('/stories/:storyId', getStory);
router.get('/stories/category/:category', filterStoriesByCategory);
router.put('/stories/:storyId/slides/:slideNumber/like', likeSlide);
router.put('/stories/:storyId/slides/:slideNumber/bookmark', bookmarkSlide);
router.put('/stories/:storyId', updateStory);
router.delete('/stories/:storyId', deleteStory);

module.exports = router;
