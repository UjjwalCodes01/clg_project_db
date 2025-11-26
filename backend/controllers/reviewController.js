const pool = require('../config/database');

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, u.Name as username, m.Title as movietitle 
      FROM Review r
      LEFT JOIN Users u ON r.UserID = u.UserID
      LEFT JOIN Movie m ON r.MovieID = m.MovieID
      ORDER BY r.Date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Get reviews by movie
exports.getReviewsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const result = await pool.query(`
      SELECT r.*, u.Name as username 
      FROM Review r
      LEFT JOIN Users u ON r.UserID = u.UserID
      WHERE r.MovieID = $1
      ORDER BY r.Date DESC
    `, [movieId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Create new review
exports.createReview = async (req, res) => {
  try {
    const { userid, movieid, rating, comment } = req.body;
    
    const result = await pool.query(
      'INSERT INTO Review (UserID, MovieID, Rating, Comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [userid, movieid, rating, comment]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    const result = await pool.query(
      'UPDATE Review SET Rating = $1, Comment = $2 WHERE ReviewID = $3 RETURNING *',
      [rating, comment, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM Review WHERE ReviewID = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
