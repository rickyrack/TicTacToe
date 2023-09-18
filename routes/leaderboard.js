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

    let highestWinsList = [...playerList];
    let highestLossesList = [...playerList];
    let highestTiesList = [...playerList];

    // put highest winning players in order
    highestWinsList.sort((a, b) => b.win - a.win);

    // put highest losing players in order
    highestLossesList.sort((a, b) => b.loss - a.loss);

    // put highest tieing players in order
    highestTiesList.sort((a, b) => b.tie - a.tie);

    // no more than 12 players visible on leaderboard
    highestWinsList = highestWinsList.slice(0, 11);
    highestLossesList = highestLossesList.slice(0, 11);
    highestTiesList = highestTiesList.slice(0, 11);

    res.render('leaderboard', {
        title: 'Leaderboard',
        username: req.body?.username,
        highestWinsList: highestWinsList,
        highestLossesList: highestLossesList,
        highestTiesList: highestTiesList
    });
});

module.exports = router;