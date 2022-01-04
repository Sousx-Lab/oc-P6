const bcrypt = require('bcrypt');
const User = require('../models/User');
const HTTPResponse = require('../services/http/http.response');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        })
        user.save()
        .then(() => HTTPResponse.OK(res, "L'utilisateur a bien été créé !"))
        .catch(error => HTTPResponse.BAD_REQUEST(res, error))
    })
    .catch(error => HTTPResponse.SERVER_ERROR(res, error));
};

exports.login = (req, res, next) => {
    HTTPResponse.OK(res, "Login !")
};