const express = require('express');
const router = express.Router();

// GET play page
router.get('/', async (req, res) => {
    res.render('play', {
        title: 'Play',
        username: req.body?.username
    });
});

module.exports = router;