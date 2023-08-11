const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('play', { title: 'Play' });
});

module.exports = router;