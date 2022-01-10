const bcrypt = require('bcrypt');
const User = require('../../models/User');
// const dataBase = require('../../middleware/database/database')
// dataBase.connect()

const needUser = async (email = "email@test.com", password = "passwordTest") => {
    await bcrypt.hash(password, 10)
        .then(hash => {
            const user = new User({email: email,password: hash});
            user.save()
                .then(() => {
                    
                })
                .catch(error => console.log(error))
                return {
                    email: email,
                    password: password
                }
        })
        .catch(error => console.log(error));
}

module.exports = {
    needUser
}