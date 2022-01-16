const mongoose = require('mongoose');

const dataBase = {
    connect: async() => {
        await mongoose.connect(process.env.DATABASE_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
          })
        .then(()=> console.log("\x1b[42m", 'Connexion à MongoDB réussie !', "\x1b[40m\n","\n"))
        .catch(() => console.log("\x1b[41m", 'Connexion à MongoDB échouée !', "\x1b[41m\n","\n"));
    },

    disconnect: async () =>{
        await mongoose.connection.close()
        .then(() => console.log("\x1b[42m", "Connection database closed", "\x1b[40m\n","\n"))
        .catch(error => console.log(error));
    },
}
module.exports = dataBase