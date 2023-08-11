const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { isLoggedIn } = require('../middleware/auth');

// GET register page
router.get('/register', isLoggedIn, (req, res) => {
  res.render('register', {
    title: 'Register',
    username: req.body?.username || undefined
  });
});

// POST create user
router.post('/register', async (req, res) => {

  // check if a password input is missing
  if (!req.body.password || !req.body.password2) {
    return res.status(400).render('register', { title: "Register", prevUsername: req.body.username, userMsg: 'Enter a password and confirm your password.' });
  }

  // check if username already exists
  try {
    const userExists = await User.findOne({ username: req.body.username });
    if(userExists) {
      return res.status(400).render('register', { title: "Register", prevUsername: req.body.username, userMsg: 'Username already exists.' });
    }
  } catch (err) {
    return res.status(500).json({ err });
  }

  // check if passwords match
  if(req.body.password !== req.body.password2) {
    return res.status(400).render('register', { title: "Register", prevUsername: req.body.username, userMsg: 'Passwords do not match..' });
  }

  // create new user
  try {
    const newUser = await User.create({
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 10)
    });

    res.redirect('/user/login');
  } catch (err) {
    res.status(500).json({ err });
  }
});

// GET login page
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
    username: req.body?.username || undefined
  });
});

// POST login user
router.post('/login', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).render('login', { title: 'Login', userMsg: 'Username or password incorrect.'});
  }
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const passSuccess = await bcrypt.compare(req.body.password, user.password);
      if (passSuccess) {
        const token = await jwt.sign({ username: user.username }, process.env.SECRET, { expiresIn: '1h' });
        res.cookie('jwt', token, { httpOnly: true })
        res.redirect('/play');
      } else {
        res.status(400).render('login', { title: 'Login', userMsg: 'Username or password incorrect.'});
      }
    } else {
      res.status(400).render('login', { title: 'Login', userMsg: 'Username incorrect.'});
    }
  } catch (err) {
    
  }
});

module.exports = router;
