const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_') + Date.now() + path.extname(file.originalname);
        callback(null, name);
    }
});

module.exports = multer({storage}).single('image')