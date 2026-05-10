const express = require('express');
const db = require('../db');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get platform stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const usersCount = await db.query('SELECT COUNT(*) FROM users');
    const tripsCount = await db.query('SELECT COUNT(*) FROM trips');
    const publicTripsCount = await db.query('SELECT COUNT(*) FROM trips WHERE is_public = TRUE');
    
    // Revenue mock since we don't have a payments table
    const revenue = 14200;

    res.json({
      stats: {
        totalUsers: parseInt(usersCount.rows[0].count),
        totalTrips: parseInt(tripsCount.rows[0].count),
        publicTrips: parseInt(publicTripsCount.rows[0].count),
        revenue
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular destinations
router.get('/destinations', adminAuth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT destination as name, COUNT(*) as trips
      FROM trips 
      WHERE destination IS NOT NULL 
      GROUP BY destination 
      ORDER BY trips DESC 
      LIMIT 10
    `);
    res.json({ destinations: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent activity
router.get('/activity', adminAuth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT u.name as user, t.title as action, t.created_at as time
      FROM trips t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT 10
    `);
    
    const formatted = result.rows.map(r => ({
      user: r.user,
      action: `Created trip "${r.action}"`,
      time: r.time
    }));

    res.json({ activity: formatted });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
