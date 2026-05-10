const express = require('express');
const db = require('../db');
const router = express.Router();

// Get activities (with optional search, category, and cost filters)
router.get('/', async (req, res) => {
  try {
    const { search, category, minCost, maxCost } = req.query;
    let query = 'SELECT * FROM activities WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (search) {
      query += ` AND name ILIKE $${paramCount}`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (category && category !== 'All') {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (minCost) {
      query += ` AND cost >= $${paramCount}`;
      params.push(minCost);
      paramCount++;
    }

    if (maxCost) {
      query += ` AND cost <= $${paramCount}`;
      params.push(maxCost);
      paramCount++;
    }

    query += ' ORDER BY rating DESC LIMIT 50';

    try {
      const result = await db.query(query, params);
      if (result.rows.length > 0) {
        return res.json({ activities: result.rows });
      }
    } catch (e) {
      // Table might not exist yet
    }

    // Fallback mock data
    res.json({ activities: [
      { id: 1, name: 'Snorkeling in Coral Reef', category: 'Water Sports', duration_hours: 3, cost: 45, rating: 4.8, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80' },
      { id: 2, name: 'Historical Walking Tour', category: 'Tours', duration_hours: 2, cost: 25, rating: 4.6, image: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=400&q=80' },
      { id: 3, name: 'Cooking Class', category: 'Food & Drink', duration_hours: 4, cost: 65, rating: 4.9, image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80' }
    ]});

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
