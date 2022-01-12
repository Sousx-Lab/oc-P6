const mongoose = require('mongoose');

const dataBase = {
    connect: async() => {
        await mongoose.connect(process.env.DATABASE_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
          })
        .then(()=> console.log('Connexion à MongoDB réussie !'))
        .catch(() => console.log('Connexion à MongoDB échouée !'));
    },

    disconnect: async () =>{
        await mongoose.connection.close()
        .then(() => console.log('Connection database closed'))
        .catch(error => console.log(error));
    },
}
module.exports = dataBase