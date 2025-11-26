const pool = require('../config/database');

// Get all actors
exports.getAllActors = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Actor ORDER BY ActorID DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching actors:', error);
    res.status(500).json({ error: 'Failed to fetch actors' });
  }
};

// Get single actor
exports.getActorById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Actor WHERE ActorID = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Actor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching actor:', error);
    res.status(500).json({ error: 'Failed to fetch actor' });
  }
};

// Create new actor
exports.createActor = async (req, res) => {
  try {
    const { name, dob, nationality } = req.body;
    
    const result = await pool.query(
      'INSERT INTO Actor (Name, DOB, Nationality) VALUES ($1, $2, $3) RETURNING *',
      [name, dob, nationality]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating actor:', error);
    res.status(500).json({ error: 'Failed to create actor' });
  }
};

// Update actor
exports.updateActor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dob, nationality } = req.body;
    
    const result = await pool.query(
      'UPDATE Actor SET Name = $1, DOB = $2, Nationality = $3 WHERE ActorID = $4 RETURNING *',
      [name, dob, nationality, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Actor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating actor:', error);
    res.status(500).json({ error: 'Failed to update actor' });
  }
};

// Delete actor
exports.deleteActor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM Actor WHERE ActorID = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Actor not found' });
    }
    
    res.json({ message: 'Actor deleted successfully' });
  } catch (error) {
    console.error('Error deleting actor:', error);
    res.status(500).json({ error: 'Failed to delete actor' });
  }
};
