const express = require('express');
const router = express.Router();

// GET register page
router.get('/', (req, res) => {
    res.render('register', { title: 'Register' });
});

module.exports = router;