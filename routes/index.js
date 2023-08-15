const express = require('express');
const router = express.Router();

// GET home page
router.get('/', (req, res) => {
    res.render('index', {
        title: 'TicTacToe',
        username: req.body?.username
    });
});

module.exports = router;
