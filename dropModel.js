require('dotenv-flow').config();
const dataBase = require('./middleware/database/database');
dataBase.connect();


const arg = process.argv.slice(2)[0]
if(undefined === arg){
    console.log("No model argument","\n","Exemple to drop User model: node dropModel User ");
    process.exit(0);
}

const model = require(`./models/${arg}`)
    if(!model){
        console.log(`${arg} model not found`);
        process.exit(0);
    }
    model.collection.drop()
        .then(() => {
            console.log(`Model: ${arg} dropped`);
            process.exit(0);
        })
        .catch((error) =>{
            console.log(error)
            process.exit(1)
    })