const Response = require('../middleware/http/http.response');
const Sauce = require('../models/Sauce');
const {jwtVerify} = require('../middleware/security/jwt');
const { json } = require('express/lib/response');

/** Get all sauces */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((sauce) => res.status(Response.HTTP_OK).json(sauce))
    .catch(error => res.status(Response.HTTP_SERVER_ERROR).json({error}));
}

/** Get one sauce by id */
exports.getOneSauce = (req, res, next) => {
    Sauce.findById({_id: req.params.id})
    .then(sauce => res.status(Response.HTTP_OK).json(sauce))
    .catch(error => res.status(Response.HTTP_NOT_FOUND).json({error}));
}

/** 
 * Create sauce 
 */
exports.createSauce = (req, res, next) => {
    const payload = JSON.parse(req.body.sauce);

    if(!payload || payload.userId !== req.token.userId){
        return res.status(Response.HTTP_UNAUTHORIZED).json({error: "Unauthorized request !"});
    }
    if(!req.file.filename){
        return res.status(Response.HTTP_BAD_REQUEST).json({message: 'Bad request !'})
    }
    
    const sauce = new Sauce({
        ...payload, 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    
    sauce.save()
        .then(() => res.status(Response.HTTP_CREATED).json({message: 'Object created !'}))
        .catch(error => res.status(Response.HTTP_SERVER_ERROR).json({error}));
}

/**
 * Modify sauce
 */
exports.modifySauce = (req, res, next) => {
    res.status(Response.HTTP_CREATED).json({message: 'sauce'})
}

/**
 * Delete sauce 
 */
exports.deleteSauce = (req, res, next) => {
    Sauce.findById({_id: req.params.id})
        .then((sauce) => {
            if(!sauce){
                return res.status(Response.HTTP_NOT_FOUND).json({message: "Object not found !"});
            }
            
            if(sauce.userId !== req.token.userId){
                return res.status(Response.HTTP_UNAUTHORIZED).json({error: "Unauthorized request !"});
            }else{
                Sauce.deleteOne({_id: sauce._id})
                .then(() => res.status(Response.HTTP_OK).json({message: 'Object has been deleted !'}))
                .catch((error) => res.status(Response.HTTP_BAD_REQUEST).json({error}));
            }
        })
        .catch(error => res.status(Response.HTTP_SERVER_ERROR).json({error}));
}

exports.ratingSauce = (req, res, next) => {
    res.status(Response.HTTP_CREATED).json({message: 'sauce'})
}