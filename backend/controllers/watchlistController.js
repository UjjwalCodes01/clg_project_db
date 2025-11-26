const pool = require('../config/database');

// Get all watchlist items
exports.getAllWatchlists = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT w.*, u.Name as username, m.Title as movietitle 
      FROM Watchlist w
      LEFT JOIN Users u ON w.UserID = u.UserID
      LEFT JOIN Movie m ON w.MovieID = m.MovieID
      ORDER BY w.DateAdded DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching watchlists:', error);
    res.status(500).json({ error: 'Failed to fetch watchlists' });
  }
};

// Get watchlist by user
exports.getWatchlistByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      SELECT w.*, m.Title, m.ReleaseYear, m.Genre 
      FROM Watchlist w
      LEFT JOIN Movie m ON w.MovieID = m.MovieID
      WHERE w.UserID = $1
      ORDER BY w.DateAdded DESC
    `, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
};

// Add to watchlist
exports.addToWatchlist = async (req, res) => {
  try {
    const { userid, movieid } = req.body;
    
    const result = await pool.query(
      'INSERT INTO Watchlist (UserID, MovieID) VALUES ($1, $2) RETURNING *',
      [userid, movieid]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'Movie already in watchlist' });
    } else {
      res.status(500).json({ error: 'Failed to add to watchlist' });
    }
  }
};

// Remove from watchlist
exports.removeFromWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM Watchlist WHERE WatchlistID = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Watchlist item not found' });
    }
    
    res.json({ message: 'Removed from watchlist successfully' });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
};
