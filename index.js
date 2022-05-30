const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { sequelize } = require('./models');
const { initialize_status, check_status, sendMessage } = require('./schedule');
require('dotenv').config();

app.use(cors({ origin: true, credentials: true}));
app.set('port', process.env.PORT || port);

sequelize.sync({ force: false })
    .then(() => {
        console.log('db connected');
    })
    .catch((err) => {
        console.error(err);
    });

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.COOKIE_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 30 * 60 * 1000
    }
}))
app.use('/auth', require('./routes/auth'));
app.use('/post', require('./routes/post'));
app.use('/status', require('./routes/status'));


check_status(1000 * 20);
sendMessage(1000 * 60 * 30);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})