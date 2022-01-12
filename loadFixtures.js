require('dotenv-flow').config();
const dataBase = require('./middleware/database/database');
const Sauce = require('./models/Sauce');
const User = require('./models/User');
const bcrypt = require('bcrypt');

async function* asyncGenerator() {
    let i = 0;
    while (i < 5) {
        yield i++;
    }
}

const generateData = async () => {
    let user = [];
    let sauce = [];
    for await (let i of asyncGenerator()) {
        user = [...user, new User({
            email: `email${i}@domain.com`,
            password: bcrypt.hashSync("password", 10)
        })];

        sauce = [...sauce, new Sauce({
            userId: user[i]._id,
            name: "Sauce" + i,
            manufacturer: "Marque" + i,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fringilla eget lacus fringilla dapibus.",
            mainPepper: "Red hot chili peppers",
            imageUrl: "https://static-01.daraz.com.bd/p/1ef55ad0e80b586da21786001dc8bda9.jpg",
            heat: i,
            likes: i,
            dislikes: i,
            usersLiked: [`email${i}domain.com`, `email${i+1}domain.com`, `email${i+1}domain.com`],
            usersDisliked: [`email${i+2}domain.com`, `email${i+2}domain.com`, `email${i+2}domain.com`],
        })];
    }
    
    Sauce.insertMany(sauce)
        .then(async () => {
            console.log('Sauce fixtures saved !')
            User.insertMany(user)
                .then(() => {
                    console.log('User fixtures saved !')
                    process.exit(0);
                })
                .catch(error => console.log(error));
        })
        .catch(error => console.log(error))
}

(async () => {
    await dataBase.connect()
        .then(async () => {
            await Sauce.deleteMany({})
            await User.deleteMany({})
                .then(async () => {
                    console.log("All collections data has been dropped !");
                    await generateData()
                })
                .catch(error => {
                    console.log(error)
                    process.exit(1);
                })
        })
        .catch((error) => {
            console.log(error)
            process.exit(1)
        });
})();