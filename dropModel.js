require('dotenv-flow').config();
const dataBase = require('./middleware/database/database');

const arg = process.argv.slice(2)[0]
if(undefined === arg){
    console.log("\x1b[41m No model argument", "\x1b[42m\n Exemple to drop User model: node dropModel User \x1b[42m\n");
    process.exit(0);
}
try {
    const model = require(`./models/${arg}`);
} catch (error) {
    console.log(`\x1b[41m Mongoose model "${arg}" Not Found! \x1b[41m\n`);
    process.exit(0);
}

(async () => {
    await dataBase.connect()
        .then(async () => {
            await model.deleteMany({})
                .then(() => {
                    console.log(`Model ${model.modelName} dropped`);
                    process.exit(0);
                })
                .catch((error) => {
                    console.log(error)
                    process.exit(1)
                });
        })
        .catch((error) => {
            console.log(error)
            process.exit(1);
        })
})();
