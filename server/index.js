const express = require('express');
const app = express();
const port = 8080;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { User } = require("./models/User");
const { Meet } = require("./models/Meet");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const config = require('./js/config/key')
const mongoose = require('mongoose');
mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/user/add_user', (req, res) => {
  
  //1. 해당 meet이 db에 있는지 체크
  Meet.findById(req.body.meet_id)
  .lean().exec(function (err, meet){
    if(err) { // 없으면 false
      return res.json({
        loginSuccess: false,
        message: "해당 meet 없음."
      });
    }else{
      //2. 있으면 add user 작업
      //2-1. user 저장
      const user = new User(req.body.user);
      //save()는 mongodb의 메서드
      user.save((err, savedUser) => {
        if(err) return res.json({ //user 저장 실패
          success: false,
          err
        });
        else { //user 저장 성공
          //2-2. meet 테이블의 users에 user id push
          Meet.findByIdAndUpdate(req.body.meet_id, {
            $push: { users: savedUser._id }
          }, function(err, old){
            if (err) return res.status(400).json({
              success: false,
              err
            });
            else {
              return res.status(200).json({
                success: true
              });
            }
          });
        }
      });   

    }
  });
});

app.post('/api/meet/add_meet', (req, res) => {
  // client에서 새로운 meet이 생성되면 db에 저장
  /*
  meet_id_tmp: {
      type: String,
      maxlength: 10
  },
  users: [
    {
        type: mongoose.Schema.Types.ObjectId, ref:'User'
    }
  ]
  */
  const meet = new Meet(req.body);

  //save()는 mongodb의 메서드
  meet.save((err, doc) => {
    if(err) return res.json({
      success: false,
      err
    });
    else return res.status(200).json({
      success: true
    });
  });

});



app.post('/api/user/login', (req, res) => {
  // 요청된 id가 db에 있는지 확인
  User.findById(req.body._id)
  .lean().exec(function (err, user){
    if(err) {
      return res.json({
        loginSuccess: false,
        message: "해당 유저 없음."
      });
    }else{
      return res.json({
        loginSuccess: true,
        userId: user._id,
        latitude: user.latitude,
        longitude: user.longitude,
        message: `hello! ${user.name} :)`
      });      
      /*
      // 토큰 만들고 브라우저 쿠키에 저장하는 부분인데
      해결 못 한 오류 있어서 주석처리해둠
      user.generateToken((err, user) => {
        if (err) {
          return res.status(400).send(err);
        }else { // 토큰을 쿠키에 저장한다
          res.cookie("x_auth", user.token)
          .status(200)
          .json({
            loginSuccess: true,
            userId: user._id,
            latitude: user.latitude,
            longitude: user.longitude
          });
        }
      });
      */
    }
  });
});


app.get('/api/hello', (req, res) => {
  res.send('hello world!');
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
