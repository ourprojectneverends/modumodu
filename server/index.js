const express = require('express');
const app = express();
const port = 8080;

const crypto = require('crypto-js');

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

// 방장 추가 API (새로운 meet과 새로운 user를 생성)
app.post('/api/user/add_master', (req, res) => {
  /*
  request body sample
  {
    "meet":{"meet_name": "테스트1", "meet_pwd": "password", "limit": "6"},
    "user":{"name":"민수", "pos":{"lat":33.450701,"long":126.570667}}
  }
  */
  
  // 1. user 추가
  let user = new User(req.body.user);
  user.pos = JSON.stringify(req.body.user.pos);
  //save()는 mongodb의 메서드
  user.save((err, savedUser) => {
    if(err) return res.status(400).json({ //user 저장 실패
      success: false,
      message: "[Add Master] Process failed"
    });
    else { //user 저장 성공
      //meet 생성
      let temp_meet = req.body.meet;
      temp_meet.users = [savedUser.id];

      const meet = new Meet(temp_meet);
      meet.save((err, savedMeet) => {
        if(err) return res.status(400).json({
          success: false,
          message: "[Add Meet] Process failed"
        });
        else return res.status(200).json({
          success: true,
          message: "Your request is processed successfully!",
          created_meet_id: savedMeet._id
        });
      });
    }
  });
});

// 사용자 추가 API (기존의 meet에 새로운 user를 생성)
app.post('/api/user/add_user', (req, res) => {
  /*
  request body sample
  {
    "meet_id": "61334ba85b7e700f18b305b3",
    "user":{"name":"민수", "pos":{"lat":33.450701,"long":126.570667}}
  }
  */
  //1. 해당 meet이 db에 있는지 체크
  Meet.findById(req.body.meet_id)
  .lean().exec(function (err, meet){
    if(err) { // 없으면 false
      return res.status(400).json({
        success: false,
        message: "No meet found matching the requested id.."
      });
    }else{
      //2. 있으면 add user 작업
      //2-1. user 저장
      let user = new User(req.body.user);
      user.pos = JSON.stringify(req.body.user.pos);
      //save()는 mongodb의 메서드
      user.save((err, savedUser) => {
        if(err) return res.status(400).json({ //user 저장 실패
          success: false,
          message: "[Add User] Process failed"
        });
        else { //user 저장 성공
          //2-2. meet 테이블의 users에 user id push
          Meet.findByIdAndUpdate(req.body.meet_id, {
            $push: { users: savedUser._id }
          }, function(err, old){
            if (err) return res.status(400).json({
              success: false,
              message: "[Push User] Process failed"
            });
            else {
              return res.status(200).json({
                success: true,
                message: "Your request is processed successfully!"
              });
            }
          });
        }
      });   
    }
  });
});

// 기존의 meet에 참여할 때 id와 pw를 검증하는 API
app.post('/api/user/join_meet', async (req, res) => {
  //req body sample: {"id":"613a0cf85987b6413079e6b4", "pw":"1234"}
  // 요청된 id가 db에 있는지 확인
  const meet = await Meet.findById(req.body.id);
  if(!meet) return res.json({
    success: false,
    message: "[Find Meet] Process failed"
  });

  meet.comparePassword(req.body.pw, (err, isMatch) => {
    if(!isMatch){
      return res.json({
        success: false,
        message: "[PWD Check] Process failed"
      });
    }
    return res.json({
      success: true,
      message: `Successfully Accessed Meet [${meet.meet_name}] :)`,
      meetMemCount: meet.users.length,
      meetMemLimit: meet.limit
    });  
  });
});

//meet 추가 test용 api
app.post('/api/test/add_meet', (req, res) => {
  // client에서 새로운 meet이 생성되면 db에 저장
  const meet = new Meet(req.body);

  //save()는 mongodb의 메서드
  meet.save((err, doc) => {
    if(err) return res.json({
      success: false,
    });
    else return res.status(200).json({
      success: true
    });
  });
});

//user 추가 test용 api
app.post('/api/test/add_user', (req, res) => {
  let user = new User(req.body);
  user.pos = JSON.stringify(req.body.pos);
  //save()는 mongodb의 메서드
  user.save((err, doc) => {
    if(err) return res.json({
      success: false,
    });
    else return res.status(200).json({
      success: true
    });
  });
});

//user 조회 test용 api
app.post('/api/test/get_user', (req, res) => {
  // 요청된 id가 db에 있는지 확인
  User.findById(req.body.user_id)
  .lean().exec(function (err, user){
    if(err) {
      return res.json({
        success: false,
        message: "해당 유저 없음."
      });
    }else{
      let userData = user;
      let bytes = crypto.AES.decrypt(userData.pos, config.AES_KEY);
      let decrypted = bytes.toString(crypto.enc.Utf8);
      userData.pos = JSON.parse(decrypted);
      return res.json({
        success: true,
        userData
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
