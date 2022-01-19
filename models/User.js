const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const {isEmail, isEmpty} = require('../middleware/security/validator')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [isEmail, "{VALUE} is not a valid email"],
    },
    password: {
        type: String, 
        required: [true, 'The password must not be empty'],
        trim: true,
        validate: [
            {
                validator:function(v) {
                    return !isEmpty(v)
                },
                message:"The password must not be empty"
            },
        ]
    }
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);