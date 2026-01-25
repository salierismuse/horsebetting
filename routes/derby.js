const express = require('express');
const db = require('../databaseshi/db');
const router = express.Router();



router.get('/derby', (req, res) => {
    const horses = db.prepare('SELECT * FROM horses').all();
    res.render('derby', {horses});
    });

module.exports = router;