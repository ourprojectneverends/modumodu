import config from './js/config';

const express = require('express');
const app = express();
const port = 8080;

const DB_PWD = config.MONGODB_PASSWORD;
const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://admin:${DB_PWD}@boiler-plate.hvwv6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


// mongodb+srv://admin:<password>@boiler-plate.hvwv6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});