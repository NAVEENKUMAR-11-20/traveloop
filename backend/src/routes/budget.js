const express = require('express');
const db = require('../db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get expenses for a trip
router.get('/:tripId', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM expenses WHERE trip_id = $1 ORDER BY date DESC',
      [req.params.tripId]
    );
    res.json({ expenses: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add expense
router.post('/:tripId', auth, async (req, res) => {
  try {
    const { category, description, amount, currency, date } = req.body;
    
    // Begin transaction
    await db.query('BEGIN');
    
    const result = await db.query(
      `INSERT INTO expenses (trip_id, user_id, category, description, amount, currency, date)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.params.tripId, req.user.id, category, description, amount, currency || 'USD', date]
    );
    
    // Update trip total spent
    await db.query(
      'UPDATE trips SET spent = spent + $1 WHERE id = $2',
      [amount, req.params.tripId]
    );
    
    await db.query('COMMIT');
    res.status(201).json({ expense: result.rows[0] });
  } catch (err) {
    await db.query('ROLLBACK');
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('BEGIN');
    
    // Get expense amount to deduct from trip total
    const exp = await db.query('SELECT amount, trip_id FROM expenses WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (exp.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    await db.query('DELETE FROM expenses WHERE id = $1', [req.params.id]);
    
    // Update trip total spent
    await db.query(
      'UPDATE trips SET spent = spent - $1 WHERE id = $2',
      [exp.rows[0].amount, exp.rows[0].trip_id]
    );
    
    await db.query('COMMIT');
    res.json({ message: 'Deleted' });
  } catch (err) {
    await db.query('ROLLBACK');
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
