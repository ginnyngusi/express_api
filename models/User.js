const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, required: true, trim: true, minlength: 2},
    password: {type: String, required: true, trim: true, minlength: 6},
    credit: {type: Number, default: 0}, 
    resetToken: {type: String, default: null},
    isAdmin: {type: Boolean, default: false}
});

module.exports = mongoose.model('User', userSchema)
