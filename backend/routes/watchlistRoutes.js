const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');

router.get('/', watchlistController.getAllWatchlists);
router.get('/user/:userId', watchlistController.getWatchlistByUser);
router.post('/', watchlistController.addToWatchlist);
router.delete('/:id', watchlistController.removeFromWatchlist);

module.exports = router;
