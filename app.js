require ('dotenv').config();
const express = require('express');
const app = express();
const derbyRoutes = require('./routes/derby');
app.use('/', derbyRoutes);
app.use(express.static('public'));

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



app.listen(port, () => {
    console.log("server listening");
})