const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 10
    },
    // meet: {
    //     type: Schema.Types.ObjectId, ref: 'Meet'
    // },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    token: {
        type: String
    }
});

/*
userSchema.pre('save', function( next ){

    // latitude, longitude 암호화



    next();
});
*/

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

const User = mongoose.model('User', userSchema);
module.exports = { User };