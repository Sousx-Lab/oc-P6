const bcrypt = require('bcrypt');
const User = require('../models/User');
const Response = require('../middleware/http/http.response');
const {jwtSign} = require('../middleware/security/jwt');
const {isEmpty, isValidPassword} = require('../middleware/security/validator');

/**SignUp */
exports.signup = (req, res, next) => {

    if(isEmpty(req.body?.password) || !isValidPassword(req.body?.password)){
        return res.status(Response.HTTP_BAD_REQUEST).json({errors: {message: 
            "Le mot de passe doit contenir 8 caracteres minimum, au moin une lettre miniscule, une lettre majuscule et un chiffres !"
        }})
    }
    
    bcrypt.hash(req.body.password, 10) 
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        })

        user.save()
            .then(() => res.status(Response.HTTP_CREATED).json({message: "The user has been successfully created !"}))
            .catch(error => res.status(Response.HTTP_BAD_REQUEST).json(error))
    })
    .catch(error => res.status(Response.HTTP_SERVER_ERROR).json({error}));
};

/** Login */
exports.login = (req, res, next) => {

    User.findOne({email: req.body.email})
    .then(user =>{
        if(!user){
            return res.status(Response.HTTP_UNAUTHORIZED).json({error: "Invalid email or password"});
        }

        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid){
                    return res.status(Response.HTTP_UNAUTHORIZED).json({error: "Invalid email or password"});
                }
                res.status(Response.HTTP_OK).json(jwtSign(user))
            })
            .catch(error => res.status(Response.HTTP_SERVER_ERROR).json({error}))
    })
    .catch(error => res.status(Response.HTTP_SERVER_ERROR).json({error}))
   
};