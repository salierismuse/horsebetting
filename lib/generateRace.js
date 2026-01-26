function generateRace(db) {
    // generate a random race
    let rand = Math.random();
    let condition = '';
    if (rand < .5) {
        condition = 'sunny';
    }
    else {
        condition = 'rainy';
    }
    const thirtyMins = 30 * 60 * 1000;
    const nextRaceTime = new Date(Math.ceil(Date.now()+ 15 * 1000));
    const result = db.prepare('INSERT INTO races (condition, start_time) VALUES (?, ?)').run(condition, nextRaceTime.toISOString());
    return result.lastInsertRowid
} 

module.exports = { generateRace };