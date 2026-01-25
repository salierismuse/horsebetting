const express = require('express');
const db = require('../databaseshi/db');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    let isMatch = false;
    if (!user) {
        isMatch = await bcrypt.compare(password, '$2a$10$dummyhashtowastetimedummyhashtowastetime');
    }
    else {
        isMatch = await bcrypt.compare(password, user.password);
    }

     if (!user || !isMatch) {
        return res.send('Invalid credentials');
     } 
     req.session.userId = user.id;
     res.redirect('/dashboard');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (db.prepare('SELECT * FROM users WHERE username = ?').get(username)) {
        return res.send('Username already taken');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashedPassword);
    res.redirect('/login');
});

module.exports = router;