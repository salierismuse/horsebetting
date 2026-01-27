const express = require('express');
const db = require('../databaseshi/db');
const router = express.Router();
const { placeBet } = require('../lib/betting.js');

router.post('/bet', (req, res) => {
    const { betAmount, horse } = req.body;
    const userId = req.session.userId;

    placeBet(betAmount, horse, userId, res.locals.nextRace, db)
    

});

module.exports = router;