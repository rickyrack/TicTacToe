const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');

/* GET users listing. */
router.get('/', (req, res) => {
  res.send('get users');
});

// POST create user
router.post('/create', async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  res.send('create user');
})

module.exports = router;
