require('dotenv-flow').config();
const dataBase = require('./middleware/database/database');
const Sauce = require('./models/Sauce');

async function* asyncGenerator() {
    var i = 0;
    while (i < 5) {
        yield i++;
    }
}
(async () => {
    let allSauces = [];
    await dataBase.connect()
        .then(async () => {
            await dataBase.deleteData(Sauce)
                .then(async () => {
                    console.log("Old data are dropped !");
                    for await (let i of asyncGenerator()) {
                        let sauce = new Sauce({
                            userId: 12345 + i,
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
                        });
                        allSauces = [...allSauces, sauce];
                    }
                })
                .then(() => {
                    Sauce.insertMany(allSauces)
                        .then(() => {
                            console.log('Sauces fixtures saved');
                            process.exit(0);
                        })
                        .catch(error => console.log(error));
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