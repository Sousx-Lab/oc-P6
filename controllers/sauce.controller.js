const Response = require('../middleware/http/http.response');
const Sauce = require('../models/Sauce');

exports.getAllSauces = (req, res, next) => {
    res.status(Response.HTTP_OK).json({message: 'sauce'})
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