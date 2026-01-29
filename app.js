require ('dotenv').config();
const express = require('express');
const app = express();
const derbyRoutes = require('./routes/derby');

app.use(express.static('public'));
const http = require('http');
const { raceRun, derby } = require('./lib/race');
const db = require('./databaseshi/db');

const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);

const port = 3000;
const session = require('express-session');
app.set('view engine', 'ejs')
app.set('views', './views');  



app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.userId;
    res.locals.currentUser = req.session.userId;

    // for fetching nextraceId
    const race = db.prepare('SELECT id FROM races ORDER BY id DESC LIMIT 1');
    const nextRaceRow = race.get();
    res.locals.nextRace = nextRaceRow ? nextRaceRow.id : null;

    // get top ten for leaderboard
    topTenRows = db.prepare('SELECT * FROM users ORDER BY winnings DESC LIMIT 10').all();
    res.locals.topTen = topTenRows.map(row => [row.username, row.winnings]);
    console.log(res.locals.topTen[0][0]);

    if (res.locals.isLoggedIn) {
        res.locals.currentBalance = db.prepare('SELECT balance FROM users WHERE id = ?').get(req.session.userId).balance;
    }
        next();
});

const betRoutes = require('./routes/bet.js');
app.use('/', betRoutes);

const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

app.get('/', (req, res) => {
    res.redirect('/derby');
});

app.post('/start-race', (req, res) => {

    const result = db.prepare('INSERT INTO races (condition, start_time) VALUES (?, ?)').run('rainy', new Date().toISOString());
    const raceId = result.lastInsertRowid;
    
    res.redirect('/derby');
});

app.use('/', derbyRoutes);

server.listen(port, () => {
    console.log("server listening");
    derby(db, io);
})