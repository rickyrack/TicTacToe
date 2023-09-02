const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET;

// GET register page
router.get('/register', (req, res) => {
  if (req.isLoggedIn) {
    return res.status(403).redirect('/');
  }

  res.render('register', {
    title: 'Register',
    username: req.body?.username
  });
});

// POST create user
router.post('/register', async (req, res) => {
  if (req.isLoggedIn) {
    return res.status(403).redirect('/');
  }

  // check if a password input is missing
  if (!req.body.password || !req.body.password2) {
    return res.status(400).render('register', { title: "Register", prevUsername: req.body.username, userMsg: 'Enter a password and confirm your password.' });
  }

    // check if passwords match
    if(req.body.password !== req.body.password2) {
      return res.status(400).render('register', { title: "Register", prevUsername: req.body.username, userMsg: 'Passwords do not match..' });
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
  if (req.isLoggedIn) {
    return res.status(403).redirect('/');
  }

  res.render('login', {
    title: 'Login',
    username: req.body?.username
  });
});

// POST login user
router.post('/login', async (req, res) => {
  if (req.isLoggedIn) {
    return res.status(403).redirect('/');
  }

  if (!req.body.username || !req.body.password) {
    console.log(req.body)
    return res.status(400).render('login', { title: 'Login', userMsg: 'Username or password incorrect.'});
  }
  try {
    console.log('look')
    const user = await User.findOne({ username: req.body.username });
    console.log('look')
    console.log(user)
    if (user) {
      const passSuccess = await bcrypt.compare(req.body.password, user.password);
      if (passSuccess) {
        const token = await jwt.sign({ username: user.username }, secret, { expiresIn: '1h' });
        res.cookie('jwt', token, { httpOnly: true })
        res.redirect('/play');
      } else {
        res.status(400).render('login', { title: 'Login', userMsg: 'Username or password incorrect.'});
      }
    } else {
      res.status(400).render('login', { title: 'Login', userMsg: 'Username incorrect.'});
    }
  } catch (err) {
    res.status(500).json({ err })
  }
});

module.exports = router;
