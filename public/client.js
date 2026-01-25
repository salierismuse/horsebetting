const socket = io();

socket.on('tick', (positions) => {
    for (const p of positions) {
        document.getElementById(`horse-${p.id}`).style.left = p.percent + '%';
    }
});

socket.on('raceEnd', (data) => {
    console.log('Winner:', data.winner);
});