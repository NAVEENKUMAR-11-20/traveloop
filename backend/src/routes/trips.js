const express = require('express');
const db = require('../db');
const { auth } = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();

// Get all trips for user
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM trips WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ trips: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single trip
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM trips WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ trip: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create trip
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, destination, start_date, end_date, cover_image, budget } = req.body;
    const shareToken = crypto.randomBytes(16).toString('hex');

    const result = await db.query(
      `INSERT INTO trips (user_id, title, description, destination, start_date, end_date, cover_image, budget, share_token)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [req.user.id, title, description, destination, start_date, end_date, cover_image, budget || 0, shareToken]
    );
    res.status(201).json({ trip: result.rows[0] });
  } catch (err) {
    console.error('Create trip error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update trip
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, destination, start_date, end_date, cover_image, budget, status } = req.body;
    const result = await db.query(
      `UPDATE trips SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        destination = COALESCE($3, destination),
        start_date = COALESCE($4, start_date),
        end_date = COALESCE($5, end_date),
        cover_image = COALESCE($6, cover_image),
        budget = COALESCE($7, budget),
        status = COALESCE($8, status),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND user_id = $10 RETURNING *`,
      [title, description, destination, start_date, end_date, cover_image, budget, status, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ trip: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete trip
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shared trip (public)
router.get('/shared/:token', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM trips WHERE share_token = $1 AND is_public = TRUE',
      [req.params.token]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ trip: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle public sharing
router.put('/:id/share', auth, async (req, res) => {
  try {
    const result = await db.query(
      'UPDATE trips SET is_public = NOT is_public WHERE id = $1 AND user_id = $2 RETURNING id, is_public, share_token',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
