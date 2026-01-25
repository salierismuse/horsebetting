function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function speedCalc(horse, condition, progress) {
    const quirks = JSON.parse(horse.quirks);
    const baseSpeed = quirks.speed;
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
    const roll = getRandomFloat(0, quirks.luck) * 100;
    return [speed, roll];
}

function tick(race_id, db) {
    
}

function raceRun(raceId, db) {

}