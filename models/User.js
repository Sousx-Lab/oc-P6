const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const {isEmail} = require('validator');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [isEmail, "Please enter a valid email"],
    },
    password: {
        type: String, 
        required: true, 
        trim: true
    }
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);