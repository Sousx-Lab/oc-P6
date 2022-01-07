const jwt = require('jsonwebtoken');

exports.jwtSign = function(user){
    if(!user){
        throw 'User not found';
    }
    return {
        userId: user._id,
        token: jwt.sign(
            {userId: user._id},
            process.env.JWT_TOKEN_SECRET,
            {expiresIn: process.env.JWT_TOKEN_EXPIRES_IN}
        )
    };
};

/**
 * @param {string} token 
 * @returns {any}
 */
exports.jwtVerify = function(token){
    if(!token){
        throw 'Token not found'
    }
    return jwt.verify(token, process.env.JWT_TOKEN_SECRET)
}