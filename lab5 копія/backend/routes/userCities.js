const express = require('express');
const router = express.Router();
const db = require('../db/firebaseAdmin');

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const doc = await db.collection('userCities').doc(userId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(doc.data());
  } catch (err) {
    console.error('Error getting user city:', err);
    res.status(500).json({ error: 'Failed to get user city' });
  }
});

router.put('/:userId', async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  try {
    await db.collection('userCities').doc(userId).set(updateData, { merge: true });
    res.json({ message: 'User city updated successfully' });
  } catch (err) {
    console.error('Error updating user city:', err);
    res.status(500).json({ error: 'Failed to update user city' });
  }
});

module.exports = router;
