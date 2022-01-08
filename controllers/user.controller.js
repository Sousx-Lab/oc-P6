const bcrypt = require('bcrypt');
const User = require('../models/User');
const Response = require('../middleware/http/http.response');
const {jwtSign} = require('../middleware/security/jwt');
const {isEmpty} = require('validator');

/**SignUp */
exports.signup = (req, res, next) => {

    if(isEmpty(req.body.password)){
        return res.status(Response.HTTP_BAD_REQUEST).json({errors: {message: "Le mot de passe ne doit pas être vide !"}})
    }
    bcrypt.hash(req.body.password, 10) 
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        })

        user.save()
            .then(() => res.status(Response.HTTP_CREATED).json({message: "L'utilisateur a bien été créé !"}))
            .catch(error => res.status(Response.HTTP_BAD_REQUEST).json(error))
    })
    .catch(error => res.status(Response.HTTP_SERVER_ERROR).json({error}));
};

/** Login */
exports.login = (req, res, next) => {

    User.findOne({email: req.body.email})
    .then(user =>{
        if(!user){
            return res.status(Response.HTTP_UNAUTHORIZED).json({error: "L'email ou le mot de passe invalide"});
        }

        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid){
                    return res.status(Response.HTTP_UNAUTHORIZED).json({error: "L'email ou le mot de passe invalide"});
                }
                res.status(Response.HTTP_OK).json(jwtSign(user))
            })
            .catch(error => res.status(Response.HTTP_SERVER_ERROR).json({error}))
    })
    .catch(error => res.status(Response.HTTP_SERVER_ERROR).json({error}))
   
};