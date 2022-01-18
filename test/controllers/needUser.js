const User = require('../../models/User')
const bcrypt = require('bcrypt');
const {jwtSign} = require('../../middleware/security/jwt');

const needUser = async () => {
    await User.deleteMany({})
        const newUser = new User({
            email: 'email@test.com', 
            password: bcrypt.hashSync('passwordTest', 10)
        });

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