require('dotenv-flow').config();
const dataBase = require('./services/database/database');
dataBase.connect();

dropModel = function(modelName){
    const model = require(`./models/${modelName}`)
    if(model){
        model.collection.drop()
        .then(() => {
            console.log(`Model: ${modelName} dropper`);
            process.exit(0);
        })
        .catch((error) =>{
            console.log(error)
            process.exit(1)
        })
    }
}

dropModel(process.argv.slice(2)[0])