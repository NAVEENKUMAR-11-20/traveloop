const express = require('express');
const db = require('../db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get all cities (with optional search and continent filter)
router.get('/', async (req, res) => {
  try {
    const { search, continent } = req.query;
    let query = 'SELECT * FROM cities WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (search) {
      query += ` AND (name ILIKE $${paramCount} OR country ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (continent && continent !== 'All') {
      query += ` AND continent = $${paramCount}`;
      params.push(continent);
      paramCount++;
    }

    query += ' ORDER BY popular DESC, rating DESC';

    // Fast-path if no DB tables exist yet (mock data fallback)
    try {
      const result = await db.query(query, params);
      if (result.rows.length > 0) {
        return res.json({ cities: result.rows });
      }
    } catch (e) {
      // Table might not exist yet during first run, fallback below
    }

    // Fallback mock data if DB empty
    res.json({ cities: [
      { id: 1, name: 'Tokyo', country: 'Japan', continent: 'Asia', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&q=80', rating: 4.9, description: 'A dazzling blend of tradition and modernity' },
      { id: 2, name: 'Paris', country: 'France', continent: 'Europe', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&q=80', rating: 4.8, description: 'The city of love and lights' },
      { id: 3, name: 'Bali', country: 'Indonesia', continent: 'Asia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&q=80', rating: 4.7, description: 'Tropical paradise with stunning temples' }
    ]});

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save city to user's saved destinations
router.post('/:id/save', auth, async (req, res) => {
  try {
    await db.query(
      'INSERT INTO saved_destinations (user_id, city_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, req.params.id]
    );
    res.json({ message: 'City saved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Unsave city
router.delete('/:id/save', auth, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM saved_destinations WHERE user_id = $1 AND city_id = $2',
      [req.user.id, req.params.id]
    );
    res.json({ message: 'City removed from saved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
