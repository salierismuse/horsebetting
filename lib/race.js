function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function speedCalc(horse, condition, progress) {
    const quirks = JSON.parse(horse.quirks);
    const baseSpeed = horse.speed;
    let speed = baseSpeed;
    if (condition === 'rainy') {
        speed *= quirks.rain;
    }
    else if (condition === 'sunny') {
        speed *= quirks.sun;
    }
    if (progress === 'start') {
        speed *= quirks.start;
    }
    else {
        speed *= quirks.end;
    }
    const roll = getRandomFloat(0-quirks.luck, quirks.luck);
    return [speed, roll, quirks];
}

function tick(state, horses, condition, order) {
    for (const horseState of state) {
        if (horseState.position < 600) {
            const horse = horses.find(h => h.id === horseState.id);
            let calc = speedCalc(horse, condition, horseState.position < 300 ? 'start' : 'end');
            let speed = calc[0];
            let roll = calc[1];
            let quirks = calc[2];
            if (roll >= quirks.luck-.1) {
                speed = 30;
            }
            else {
                speed += roll;
            }
            if (horseState.position + speed > 600 ) {
                horseState.position = 600;
                order.push(horseState.id);
            }
            else {
                horseState.position += speed;
            }
        }
    }
}

function raceRun(raceId, db, io) {
    let order = [];
    let horses = db.prepare('SELECT * FROM horses').all();
    const condition = db.prepare('SELECT condition FROM races WHERE id = ?').get(raceId).condition;
    const state = horses.map(h => ({
        id: h.id,
        position: 0,
        burstRemaining: 0
    }));

    const interval = setInterval(() => {
        tick(state, horses, condition, order);

        io.emit('tick', state.map(h => ({id: h.id, percent: h.position/600*100})));

        if (order.length === horses.length) {
            clearInterval(interval);
            const winner = order[0];
            db.prepare('UPDATE races SET end_time = ?, winner_horse_id = ? WHERE id = ?').run(new Date().toISOString(), winner, raceId);
            io.emit('raceEnd', { winner });
        }
         console.log(state.map(h => `${h.id}: ${h.position.toFixed(1)}`).join(' | '));
    }, 500);
}

module.exports = { raceRun };