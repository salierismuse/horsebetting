const socket = io();

socket.on('tick', (positions) => {
    for (const p of positions) {
        document.getElementById(`horse-${p.id}`).style.left = p.percent + '%';
    }
});

socket.on('raceEnd', (data) => {
    console.log('Winner:', data.winner);
    const horses = document.querySelectorAll('.horse');
    setTimeout(() => {
            horses.forEach(horse => {
                horse.style.left = '0%';
            });
        }, 2000); 
});