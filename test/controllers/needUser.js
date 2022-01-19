const User = require('../../models/User')
const bcrypt = require('bcrypt');
const {jwtSign} = require('../../middleware/security/jwt');

const needUser = async () => {
    const newUser = new User({
        email: 'email@test.com', 
        password: bcrypt.hashSync('PasswordTest1', 10)
    });
    await User.deleteMany({})   
    await newUser.save()
    return newUser;
}

const needAuthorizationToken = (user) => {
    return jwtSign(user);
}

module.exports = {
    needUser,
    needAuthorizationToken
}