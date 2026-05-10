const express = require('express');
const db = require('../db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get itinerary for a trip
router.get('/:tripId', auth, async (req, res) => {
  try {
    const days = await db.query(
      'SELECT * FROM itinerary_days WHERE trip_id = $1 ORDER BY day_number',
      [req.params.tripId]
    );
    const activities = await db.query(
      'SELECT * FROM itinerary_activities WHERE trip_id = $1 ORDER BY order_index',
      [req.params.tripId]
    );
    res.json({ days: days.rows, activities: activities.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add day
router.post('/:tripId/days', auth, async (req, res) => {
  try {
    const { day_number, date, title, notes } = req.body;
    const result = await db.query(
      'INSERT INTO itinerary_days (trip_id, day_number, date, title, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.params.tripId, day_number, date, title, notes]
    );
    res.status(201).json({ day: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add activity
router.post('/:tripId/activities', auth, async (req, res) => {
  try {
    const { day_id, name, description, time, duration_minutes, cost, type, location, order_index } = req.body;
    const result = await db.query(
      `INSERT INTO itinerary_activities (day_id, trip_id, name, description, time, duration_minutes, cost, type, location, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [day_id, req.params.tripId, name, description, time, duration_minutes, cost || 0, type || 'other', location, order_index || 0]
    );
    res.status(201).json({ activity: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update activity order (for drag-and-drop)
router.put('/activities/reorder', auth, async (req, res) => {
  try {
    const { activities } = req.body; // [{id, order_index, day_id}]
    for (const act of activities) {
      await db.query(
        'UPDATE itinerary_activities SET order_index = $1, day_id = $2 WHERE id = $3',
        [act.order_index, act.day_id, act.id]
      );
    }
    res.json({ message: 'Reordered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete activity
router.delete('/activities/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM itinerary_activities WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete day
router.delete('/days/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM itinerary_days WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
