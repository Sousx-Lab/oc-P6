const mongoose = require('mongoose');
const sanitizer = require('mongoose-sanitize');

const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true, trim: true,},
    manufacturer: {type: String, trim: true},
    description: {type: String, required: true, trim: true},
    mainPepper: {type: String, required: true,},
    imageUrl: {type: String, required: true, trim: true},
    heat: {type: Number, required: true, trim: true},
    likes: {type: Number},
    dislikes: {type: Number},
    usersLiked: {type: Array},
    usersDisliked: {type: Array}
});
sauceSchema.plugin(sanitizer);
module.exports = mongoose.model('Sauce', sauceSchema);