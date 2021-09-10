const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');

const config = require('../js/config/key');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 10
    },
    token: {
        type: String
    },
    pos: {
        type: String
    }
});


userSchema.pre('save', function( next ){
    let user = this;
    if(user.isModified('pos')){
        const ciphertext = crypto.AES.encrypt(user.pos, config.AES_KEY).toString();
        user.pos = ciphertext;
        next();
    }else{
        next();
    }
});

/*
userSchema.methods.generateToken = function(cb) {
    var user = this;
    //jsonwebtoken을 이용한 토큰 생성
    var token = jwt.sign(user._id.toHexString(), 'modumodu');
    user.token = token;
    user.save(function(err, user) {
        if(err) return cb(err)
        else cb(null, user)
    });
}
*/
const User = mongoose.model('User', userSchema);
module.exports = { User };