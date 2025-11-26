const pool = require('../config/database');

// Get all directors
exports.getAllDirectors = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Director ORDER BY DirectorID DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching directors:', error);
    res.status(500).json({ error: 'Failed to fetch directors' });
  }
};

// Get single director
exports.getDirectorById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Director WHERE DirectorID = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Director not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching director:', error);
    res.status(500).json({ error: 'Failed to fetch director' });
  }
};

// Create new director
exports.createDirector = async (req, res) => {
  try {
    const { name, dob, nationality } = req.body;
    
    const result = await pool.query(
      'INSERT INTO Director (Name, DOB, Nationality) VALUES ($1, $2, $3) RETURNING *',
      [name, dob, nationality]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating director:', error);
    res.status(500).json({ error: 'Failed to create director' });
  }
};

// Update director
exports.updateDirector = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dob, nationality } = req.body;
    
    const result = await pool.query(
      'UPDATE Director SET Name = $1, DOB = $2, Nationality = $3 WHERE DirectorID = $4 RETURNING *',
      [name, dob, nationality, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Director not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating director:', error);
    res.status(500).json({ error: 'Failed to update director' });
  }
};

// Delete director
exports.deleteDirector = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM Director WHERE DirectorID = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Director not found' });
    }
    
    res.json({ message: 'Director deleted successfully' });
  } catch (error) {
    console.error('Error deleting director:', error);
    res.status(500).json({ error: 'Failed to delete director' });
  }
};
