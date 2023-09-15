const express = require('express');
const User = require('../models/User');
const router = express.Router();

// GET leaderboard page
router.get('/', async (req, res) => {
    let playerList;
    try {
        playerList = await User.find();
    } catch (err) {
        console.log(`Error: ${err.message}`);
        return res.redirect('/');
    }

    const highestWinsList = [...playerList];

    // put highest winning players in order
    highestWinsList.sort((a, b) => b.win - a.win);

    res.render('leaderboard', {
        title: 'Leaderboard',
        username: req.body?.username,
        highestWinsList: highestWinsList
        // add more options here
    });
});

module.exports = router;