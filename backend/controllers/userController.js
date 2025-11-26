const pool = require('../config/database');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT UserID, Name, Email, DateJoined FROM Users ORDER BY UserID DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get single user
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT UserID, Name, Email, DateJoined FROM Users WHERE UserID = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const result = await pool.query(
      'INSERT INTO Users (Name, Email, Password) VALUES ($1, $2, $3) RETURNING UserID, Name, Email, DateJoined',
      [name, email, password]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    
    let query, params;
    if (password) {
      query = 'UPDATE Users SET Name = $1, Email = $2, Password = $3 WHERE UserID = $4 RETURNING UserID, Name, Email, DateJoined';
      params = [name, email, password, id];
    } else {
      query = 'UPDATE Users SET Name = $1, Email = $2 WHERE UserID = $3 RETURNING UserID, Name, Email, DateJoined';
      params = [name, email, id];
    }
    
    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM Users WHERE UserID = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
