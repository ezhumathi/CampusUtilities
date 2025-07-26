const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/secure-data', authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, here’s your protected info.` });
});

module.exports = router;
