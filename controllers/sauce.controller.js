const Response = require('../middleware/http/http.response');
const Sauce = require('../models/Sauce');
const User = require('../models/User');
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
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => res.status(Response.HTTP_OK).json(sauce))
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
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes:0,
    });
    
    sauce.save()
        .then(() => res.status(Response.HTTP_CREATED).json({message: 'Object created !'}))
        .catch(error => res.status(Response.HTTP_SERVER_ERROR).json({error}));
}

/**
 * Modify sauce
 */
exports.modifySauce = (req, res, next) => {
   
    const payload = {
        uploadedFile: req.file?.filename === undefined ? null : req.file.filename,
        sauce: req.file?.filename === undefined ? req.body : JSON.parse(req.body.sauce)
    }

    if(payload.sauce.userId !== req.token.userId ){
        return res.status(Response.HTTP_UNAUTHORIZED).json({error: "Unauthorized request !"});
    }

    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {  
            if(sauce.userId !== req.token.userId){
                return res.status(Response.HTTP_UNAUTHORIZED).json({error: "Unauthorized request !"});

            }
            if(payload.uploadedFile){
                const filename = sauce.imageUrl.split('/images/')[1];
                if(fs.existsSync(`images/${filename}`)){
                    fs.unlink(`images/${filename}`, (err) => {
                            if(err){
                                throw new Error(`the file ${filename} was not deleted`)
                            }
                        });
                }
                sauce.imageUrl = `${req.protocol}://${req.get('host')}/images/${payload.uploadedFile}`;
            }
            Object.assign(sauce, payload.sauce)
            sauce.save()
                .then(() => {
                    return res.status(Response.HTTP_OK).json('Object modified !') 
                })
                .catch(error => res.status(Response.HTTP_SERVER_ERROR).json(error));
        })
        .catch(error => res.status(Response.HTTP_BAD_REQUEST).json(error));
    
}

/**
 * Delete sauce 
 */
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {  
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

    const payload = req.body;
    if(payload.userId !== req.token.userId){
        return res.status(Response.HTTP_UNAUTHORIZED).json({error: "Unauthorized request !"});
    }
    
    Sauce.findOne({_id: req.params.id})
        .then(async(sauce) => {
            
            User.findOne({_id: req.token.userId})
            .then( async(user) => {
            
            switch (payload.like) {
                case 1:
                    if(!sauce.usersLiked.includes(user.email)){
                        sauce.likes++;
                        sauce.usersLiked.push(user.email);
                        if(sauce.usersDisliked.includes(user.email)){
                            sauce.dislikes--
                            sauce.usersDisliked = sauce.usersDisliked.filter((v) =>{return v !== user.email});
                        }
                    }
                    break;
                case -1:
                    if(!sauce.usersDisliked.includes(user.email)){
                        sauce.dislikes++
                        sauce.usersDisliked.push(user.email);
                        if(sauce.usersLiked.includes(user.email)){
                            sauce.likes--
                            sauce.usersLiked = sauce.usersLiked.filter((v) =>{return v !== user.email});
                        }
                    }
                   break;
                case 0:
                    if(sauce.usersDisliked.includes(user.email)){
                        sauce.dislikes--
                        sauce.usersDisliked = sauce.usersDisliked.filter((v) =>{return v !== user.email});
                    }
                    if(sauce.usersLiked.includes(user.email)){
                        sauce.likes--
                        sauce.usersLiked = sauce.usersLiked.filter((v) =>{return v !== user.email});
                    }
                    break;
                default:
                    return res.status(Response.HTTP_BAD_REQUEST).json({error: "Value must be 1, 0 or -1"});
            }
            
            await sauce.save()
                .then(() => {
                    res.status(Response.HTTP_OK).json('Objet liked')
                })
                .catch(error => res.status(Response.HTTP_SERVER_ERROR).json({error}))
            })
            .catch(error => res.status(Response.HTTP_UNAUTHORIZED).json({error: "Unauthorized request !"}))
        })
        .catch(error => res.status(Response.HTTP_BAD_REQUEST).json(error))
}