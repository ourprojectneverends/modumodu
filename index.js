// const Config = require('./js/config/config.js');
// import config from './js/config.js';

const express = require('express');
const app = express();
const port = 8080;

const bodyParser = require('body-parser');
const { User } = require("./models/User");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const config = require('./js/config/key')
// const DB_PWD = Config.config.MONGODB_PASSWORD;
// const DB_PWD = config.MONGODB_PASSWORD;
const mongoose = require('mongoose');
mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/add_user', (req, res) => {
  // 유저 하나의 정보를 client에서 가져오면
  // 그 정보를 DB에 넣어줌
  const user = new User(req.body);

  //save()는 mongodb의 메서드
  user.save((err, doc) => {
    if(err) return res.json({
      success: false,
      err
    });
    else return res.status(200).json({
      success: true
    });
  });

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});