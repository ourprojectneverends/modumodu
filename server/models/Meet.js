const mongoose = require('mongoose');

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

/*
meetSchema.pre('save', function( next ){

});
*/


const Meet = mongoose.model('Meet', meetSchema);
module.exports = { Meet };