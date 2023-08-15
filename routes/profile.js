const express = require('express');
const router = express.Router();

// GET profile page
router.get('/', (req, res) => {
    res.render('profile', {
        title: 'Profile',
        username: req.body?.username
    });
});

module.exports = router;