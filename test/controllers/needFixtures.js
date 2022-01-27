const mongoose = require('mongoose');
const Sauce = require('../../models/Sauce');

async function* asyncGenerator() {
    let i = 1;
    while (i <= 5) {
        yield i++;
    }
}
const needFixtures = async(user) => {
    await Sauce.deleteMany({});
    let sauce = [];
    for await (let i of asyncGenerator()) {
        sauce = [...sauce, new Sauce({
            userId: (i > 2) ? user._id : mongoose.Types.ObjectId(),
            name: "SauceTest" + i,
            manufacturer: "MarqueTest" + i,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fringilla eget lacus fringilla dapibus.",
            mainPepper: "Red hot chili peppers",
            imageUrl: "https://static-01.daraz.com.bd/p/1ef55ad0e80b586da21786001dc8bda9.jpg",
            heat: i,
            likes: 0,
            dislikes:0,
            usersLiked: [],
            usersDisliked: [],
        })];
    }
    return Sauce.insertMany(sauce)
        .then(() => {
            console.log("\x1b[42m", "Sauce fixtures test saved !", "\x1b[40m\n")
            return sauce
        })
        .catch(error => console.log(error))

}

module.exports = {
    needFixtures
}
