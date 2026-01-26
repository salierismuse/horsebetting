require ('dotenv').config();
const express = require('express');
const app = express();
const derbyRoutes = require('./routes/derby');
app.use('/', derbyRoutes);
app.use(express.static('public'));
const http = require('http');
const { raceRun } = require('./lib/race');
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

const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

app.get('/', (req, res) => {
    res.redirect('/derby');
});

app.post('/start-race', (req, res) => {

    const result = db.prepare('INSERT INTO races (condition, start_time) VALUES (?, ?)').run('rainy', new Date().toISOString());
    const raceId = result.lastInsertRowid;
    raceRun(raceId, db, io);
    
    res.redirect('/derby');
});

server.listen(port, () => {
    console.log("server listening");
})