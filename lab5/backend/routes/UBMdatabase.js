const express = require('express');
const router = express.Router();
const db = require('../db/firebaseAdmin'); 

router.get('/:type', async (req, res) => {
  const { type } = req.params;
  console.log('Request for /api/ubm/' + type); 

  try {
    const doc = await db.collection('UBMdatabase').doc(type).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(doc.data());
  } catch (err) {
    console.error('Error getting UBM data:', err);
    res.status(500).json({ error: 'Failed to get UBM data' });
  }
});

module.exports = router;
