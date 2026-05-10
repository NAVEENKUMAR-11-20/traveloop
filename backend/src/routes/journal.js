const express = require('express');
const db = require('../db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get journal entries for a trip
router.get('/:tripId', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM journal_entries WHERE trip_id = $1 AND user_id = $2 ORDER BY date DESC, created_at DESC',
      [req.params.tripId, req.user.id]
    );
    res.json({ entries: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add journal entry
router.post('/:tripId', auth, async (req, res) => {
  try {
    const { title, content, date, mood } = req.body;
    const result = await db.query(
      `INSERT INTO journal_entries (trip_id, user_id, title, content, date, mood)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.params.tripId, req.user.id, title, content, date || new Date().toISOString().split('T')[0], mood]
    );
    res.status(201).json({ entry: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update journal entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, date, mood } = req.body;
    const result = await db.query(
      `UPDATE journal_entries SET 
        title = COALESCE($1, title), 
        content = COALESCE($2, content), 
        date = COALESCE($3, date), 
        mood = COALESCE($4, mood),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND user_id = $6 RETURNING *`,
      [title, content, date, mood, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json({ entry: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete journal entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM journal_entries WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
