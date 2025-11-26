const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getAllDirectors,
  getAllActors
} = require('../controllers/movieController');

// Movie routes
router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', createMovie);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);

// Helper routes
router.get('/helpers/directors', getAllDirectors);
router.get('/helpers/actors', getAllActors);

module.exports = router;
