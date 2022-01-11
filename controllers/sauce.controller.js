const Response = require('../middleware/http/http.response');
const Sauce = require('../models/Sauce');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((sauce) => res.status(Response.HTTP_OK).json(sauce))
    .catch(error => res.status(Response.HTTP_SERVER_ERROR).json({error}))
}

exports.getOneSauce = (req, res, next) => {
    res.status(Response.HTTP_OK).json({message: 'sauce'})
}

exports.createSauce = (req, res, next) => {
    res.status(Response.HTTP_CREATED).json({message: 'sauce'})
}

exports.modifySauce = (req, res, next) => {
    res.status(Response.HTTP_CREATED).json({message: 'sauce'})
}

exports.deleteSauce = (req, res, next) => {
    res.status(Response.HTTP_CREATED).json({message: 'sauce'})
}

exports.ratingSauce = (req, res, next) => {
    res.status(Response.HTTP_CREATED).json({message: 'sauce'})
}