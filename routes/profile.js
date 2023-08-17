const express = require('express');
const User = require('../models/User');
const router = express.Router();

// GET profile page
router.get('/', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        res.render('profile', {
            title: 'Profile',
            username: req.body.username,
            games: 0,
            win: user.win,
            loss: user.loss
        });
    } catch (err) {
        res.status(500).redirect('/user/login');
    }

});

module.exports = router;