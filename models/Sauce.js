const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUlr: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number},
    dislikes: {type: Number},
    usersLiked: {type: Array},
    usersDisliked: {type: Array}
});

module.exports = mongoose.model('Sauce', sauceSchema);