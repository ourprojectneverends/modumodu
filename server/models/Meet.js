const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const meetSchema = mongoose.Schema({
    // meet: {
    //     type: Schema.Types.ObjectId, ref: 'Meet'
    // },
    meet_name: {
        type: String,
        maxlength: 10
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId, ref:'User'
        }
    ],
    meet_pwd: {
        type: String
    },
    limit: {
        type: Number
    }
});


meetSchema.pre('save', function( next ){
    let meet = this;
    if(meet.isModified('meet_pwd')){
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
            bcrypt.hash(meet.meet_pwd, salt, function(err, hash){
                if(err) return next(err);
                meet.meet_pwd = hash;
                next();
            });
        });
    }else{
        next();
    }
});

meetSchema.methods.comparePassword = function(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.meet_pwd, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    });
}

const Meet = mongoose.model('Meet', meetSchema);
module.exports = { Meet };