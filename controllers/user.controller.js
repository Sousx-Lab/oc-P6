const bcrypt = require('bcrypt');
const User = require('../models/User');
const Response = require('../services/http/http.response');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        })
        user.save()
        .then(() => res.status(Response.HTTP_CREATED).json({message: "L'utilisateur a bien été créé !"}))
        .catch(error => res.status(Response.HTTP_BAD_REQUEST).json({error}))
    })
    .catch(error => res.status(Response.HTTP_SERVER_ERROR).json({error}));
};

exports.login = (req, res, next) => {
    res.status(Response.HTTP_OK).json({message: "Login !"})
};