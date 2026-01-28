const express = require('express');
const db = require('../databaseshi/db');
const router = express.Router();
const { placeBet } = require('../lib/betting.js');

router.post('/bet', (req, res) => {
    const { betAmount, horseId } = req.body;
    const userId = req.session.userId;

    placeBet(betAmount, horseId, userId, res.locals.nextRace, db)
    res.redirect('/');

});

module.exports = router;