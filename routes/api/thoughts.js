const router = require('express').Router();
const {
  getThought,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction
} = require('../../controllers/thoughtsController');


// /api/thoughts
router
  .route('/')
  .get(getThought)

router
  .route("/:userId")
  .post(createThought)

// /api/thoughts/:thoughtId
router
  .route('/:thoughtId')
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

router
  .route('/:thoughtId/reactions')
  .post(createReaction);

router
  .route('/:thoughtId/reactions/:reactionId')
  .delete(deleteReaction)

module.exports = router;
