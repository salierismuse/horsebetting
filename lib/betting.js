function placeBet(betAmount, horseId, userId, raceId, db) {
    const transaction = db.transaction(() => {
    const userBalance = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId).balance;
    if (userBalance < betAmount) {
        throw new Error('Insufficient balance');
    }
    db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').run(betAmount, userId);
    db.prepare('INSERT INTO bets(user_id, horse_id, race_id, amount) VALUES (?, ?, ?, ?)').run(userId, horseId, raceId, betAmount);
    });
    transaction();
    return true;
}

function payout(raceId, db) {
    const winner = db.prepare('SELECT winner_horse_id FROM races WHERE id = ?').get(raceId).winner_horse_id;
    let totalAmount = db.prepare('SELECT SUM(amount) as total FROM bets WHERE race_id = ?').get(raceId).total || 0;
    totalAmount -= (totalAmount*.15); // house cut
    let horses = db.prepare('SELECT * FROM horses').all();
    
    let horseMap = {};
    for (let i = 0; i < horses.length; i++) {
        horseMap[horses[i].id] = totalAmount/(db.prepare('SELECT SUM(amount) as total from bets WHERE horse_id = ? AND race_id = ?').get(horses[i].id, raceId).total || 1);
    }


    const bets = db.prepare('SELECT * FROM bets WHERE race_id = ? AND horse_id = ?').all(raceId, winner);
    db.transaction(() => {
    for (let i of bets) {
        const payout = i.amount * (horseMap[winner]);
        db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(payout, i.user_id);
        db.prepare('UPDATE users SET winnings = winnings + ? where id = ? ').run(payout, i.user_id);
    }
    })();
};
   
module.exports = { placeBet, payout };