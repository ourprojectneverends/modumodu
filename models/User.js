const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 10
    },
    meet: {
        type: Schema.Types.ObjectId, ref: 'Meet'
    },
    latitude: {
        type: Number
    },
    logitude: {
        type: Number
    }
});

const User = mongoose.model('User', userSchema);
module.exports = { User };