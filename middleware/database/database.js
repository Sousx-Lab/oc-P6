const mongoose = require('mongoose');

const dataBase = {
    connect: async() => {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          })
        .then(() => console.log('Connexion à MongoDB réussie !'))
        .catch(() => console.log('Connexion à MongoDB échouée !'));
    },

    close: async () =>{
        await mongoose.connection.close(true)
        .then(() => console.log('Database closed'))
        .catch(error => console.log(error));
    },

    dropModel: async(model) => {
        await model.collection.drop()
    .then(() => {
        console.log(`Model User dropped`);
    })
    .catch((error) =>{
        console.log(error)
        process.exit(1)
    })
    } 
}
module.exports = dataBase