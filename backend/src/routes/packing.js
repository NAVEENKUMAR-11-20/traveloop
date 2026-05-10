const express = require('express');
const db = require('../db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get packing items for a trip
router.get('/:tripId', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM packing_items WHERE trip_id = $1 ORDER BY id DESC',
      [req.params.tripId]
    );
    res.json({ items: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add packing item
router.post('/:tripId', auth, async (req, res) => {
  try {
    const { item, category } = req.body;
    const result = await db.query(
      'INSERT INTO packing_items (trip_id, item, category) VALUES ($1, $2, $3) RETURNING *',
      [req.params.tripId, item, category || 'other']
    );
    res.status(201).json({ item: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle packed status
router.put('/:id/toggle', auth, async (req, res) => {
  try {
    const result = await db.query(
      'UPDATE packing_items SET is_checked = NOT is_checked WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    res.json({ item: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM packing_items WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
