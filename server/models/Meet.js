const mongoose = require('mongoose');

const meetSchema = mongoose.Schema({
    // meet: {
    //     type: Schema.Types.ObjectId, ref: 'Meet'
    // },
    meet_id_tmp: {
        type: String,
        maxlength: 10
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId, ref:'User'
        }
    ]
});

/*
meetSchema.pre('save', function( next ){

});
*/


const Meet = mongoose.model('Meet', meetSchema);
module.exports = { Meet };