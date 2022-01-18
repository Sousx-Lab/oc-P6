const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
/**
 * @param {object} user 
 * @returns {object|Error}
 */
exports.jwtSign = function (user) {
    if(!user instanceof mongoose.model){
        throw 'User not found';
    }
    return {
        userId: user._id,
        token: jwt.sign({

                userId: user._id,
                email: user.email
            },
            process.env.JWT_TOKEN_SECRET, {
                expiresIn: process.env.JWT_TOKEN_EXPIRES_IN
            }
        )
    };
};

/**
 * @param {string} token 
 * @returns {object|null}
 */
exports.jwtVerify = function (token) {
    if (!token) {
        throw 'Token not found'
    }
    return jwt.verify(token, process.env.JWT_TOKEN_SECRET)
}