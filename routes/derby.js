const express = require('express');
const db = require('../databaseshi/db'); 
const router = express.Router();

router.get('/derby', (req, res) => {
    const horses = db.prepare('SELECT * FROM horses').all();

    const nextRace = db.prepare('SELECT start_time FROM races WHERE start_time > ? ORDER BY start_time ASC LIMIT 1').get(new Date().toISOString());

    let raceStartTime = 0;

    if (nextRace) {
        raceStartTime = new Date(nextRace.start_time).getTime();
    } else {
        raceStartTime = Date.now() + 1 * 60 * 1000;
    }

    res.render('derby', { 
        horses, 
        raceStartTime 
    });
});

module.exports = router;