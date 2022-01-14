const Response = require('../middleware/http/http.response');
const Sauce = require('../models/Sauce');
const fs = require('fs');
/** 
 * Get all sauces 
 */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((sauce) => res.status(Response.HTTP_OK).json(sauce))
    .catch(error => res.status(Response.HTTP_SERVER_ERROR).json({error}));
}

/** 
 * Get one sauce by id 
 */
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
        return res.status(Response.HTTP_BAD_REQUEST).json({message: 'Bad request: Image required !'})
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
   
    const payload = req.file?.filename === undefined ? req.body : req.body.sauce
    
    if(payload?.sauce && !req.file?.filename){
        return res.status(Response.HTTP_BAD_REQUEST).json({message: 'Bad request: Image required !'})
    }

    if(payload?.userId && payload?.userId !== req.token.userId ){
        return res.status(Response.HTTP_UNAUTHORIZED).json({error: "Unauthorized request"});
    }
    if(payload?.sauce?.userId && payload?.sauce.userId !== req.token.userId){
        return res.status(Response.HTTP_UNAUTHORIZED).json({error: "Unauthorized request"});
    }

    Sauce.findById({_id: req.params.id})
        .then((sauce) => {
            if(!sauce){
                return res.status(Response.HTTP_NOT_FOUND).json({message: "Object not found !"});
            }
            
            if(sauce.userId !== req.token.userId){
                return res.status(Response.HTTP_UNAUTHORIZED).json({error: "Unauthorized request !"});

            }
            
            if(req.file?.filename !== undefined){
                const filename = sauce.imageUrl.split('/images/')[1];
                if(fs.existsSync(`images/${filename}`)){
                    fs.unlink(`images/${filename}`, (err) => {
                            if(err){
                                throw new Error(`the file ${filename} was not deleted`)
                            }
                        });
                }
                sauce.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            }
            Object.assign(sauce, payload)
            sauce.save()
                .then(() => {
                    return res.status(Response.HTTP_OK).json('Object modified !') 
                })
                .catch(error => res.status(Response.HTTP_SERVER_ERROR).json(error));
        })
        .catch(error => res.status(Response.HTTP_BAD_REQUEST).json('qsdqsdqsd'));
    
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

            }
            else{
                const filename = sauce.imageUrl.split('/images/')[1];
                if(fs.existsSync(`images/${filename}`)){
                    fs.unlink(`images/${filename}`, (err) => {
                        if(err){
                            throw new Error(`the file ${filename} was not deleted`)
                        }
                    });
                }
                Sauce.deleteOne({_id: sauce._id})
                    .then(() => res.status(Response.HTTP_OK).json({message: 'Object has been deleted !'}))
                    .catch((error) => res.status(Response.HTTP_BAD_REQUEST).json({error}));
                
            }
        })
        .catch(error => res.status(Response.HTTP_SERVER_ERROR).json({error}));
}

/** Like unLike sauce */
exports.ratingSauce = (req, res, next) => {
    res.status(Response.HTTP_CREATED).json({message: 'sauce'})
}