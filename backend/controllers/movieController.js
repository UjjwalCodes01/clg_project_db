const pool = require('../config/database');

// Get all movies with their directors and actors
const getAllMovies = async (req, res) => {
  try {
    const query = `
      SELECT 
        m.*,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', d.directorid, 'name', d.name)) 
          FILTER (WHERE d.directorid IS NOT NULL), '[]'
        ) as directors,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', a.actorid, 'name', a.name)) 
          FILTER (WHERE a.actorid IS NOT NULL), '[]'
        ) as actors
      FROM Movie m
      LEFT JOIN Movie_Directors md ON m.movieid = md.movieid
      LEFT JOIN Director d ON md.directorid = d.directorid
      LEFT JOIN Movie_Actors ma ON m.movieid = ma.movieid
      LEFT JOIN Actor a ON ma.actorid = a.actorid
      GROUP BY m.movieid
      ORDER BY m.movieid DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get single movie by ID
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        m.*,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', d.directorid, 'name', d.name)) 
          FILTER (WHERE d.directorid IS NOT NULL), '[]'
        ) as directors,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', a.actorid, 'name', a.name)) 
          FILTER (WHERE a.actorid IS NOT NULL), '[]'
        ) as actors
      FROM Movie m
      LEFT JOIN Movie_Directors md ON m.movieid = md.movieid
      LEFT JOIN Director d ON md.directorid = d.directorid
      LEFT JOIN Movie_Actors ma ON m.movieid = ma.movieid
      LEFT JOIN Actor a ON ma.actorid = a.actorid
      WHERE m.movieid = $1
      GROUP BY m.movieid
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create new movie
const createMovie = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { title, releaseyear, duration, genre, language, rating } = req.body;
    
    const movieQuery = `
      INSERT INTO Movie (title, releaseyear, duration, genre, language, rating)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const movieResult = await client.query(movieQuery, [
      title, releaseyear, duration, genre, language, rating
    ]);
    
    await client.query('COMMIT');
    res.status(201).json(movieResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating movie:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

// Update movie
const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, releaseyear, duration, genre, language, rating } = req.body;
    
    const query = `
      UPDATE Movie 
      SET title = $1, releaseyear = $2, duration = $3, genre = $4, language = $5, rating = $6
      WHERE movieid = $7
      RETURNING *
    `;
    const result = await pool.query(query, [
      title, releaseyear, duration, genre, language, rating, id
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete movie
const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM Movie WHERE movieid = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json({ message: 'Movie deleted successfully', movie: result.rows[0] });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all directors
const getAllDirectors = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Director ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching directors:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all actors
const getAllActors = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Actor ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching actors:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getAllDirectors,
  getAllActors
};
