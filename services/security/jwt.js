const jwt = require('jsonwebtoken');

exports.jwtSign = function(user){
    if(!user){
        return null;
    }
    return {
        userId: user._id,
        token: jwt.sign(
            {userId: user._id},
            process.env.JWT_TOKEN_SECRET,
            {expiresIn: '24h'}
        )
    };
};