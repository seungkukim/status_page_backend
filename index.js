const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
const { sequelize } = require('./models');

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
app.use('/post', require('./routes/post'));
app.use('/status', require('./routes/status'));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})