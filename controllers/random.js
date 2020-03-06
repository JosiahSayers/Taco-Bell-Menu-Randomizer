const express = require('express');
const router = express.Router();
const randomMenuItem = require('../menu-service');

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});

router.get('/single', async (req, res) => {
  let randomItem;

  try {
    randomItem = await randomMenuItem();
    res.json(randomItem);
  } catch {
    res.status(500).json({ error: 'unknown error' });
  }
});

module.exports = router;