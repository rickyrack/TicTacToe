const express = require('express');
const router = express.Router();

// GET leaderboard page
router.get('/', (req, res) => {
    res.render('leaderboard', {
        title: 'Leaderboard',
        username: req.body?.username
    });
});

module.exports = router;