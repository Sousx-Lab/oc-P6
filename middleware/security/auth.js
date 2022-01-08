const {jwtVerify} = require('../services/security/jwt');
const Response = require('../services/http/http.response');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwtVerify(token);
        const userId = decodedToken.userId;
        if(req.userId &&  req.body.userId !== userId){
            throw 'User ID not valide';
        }else{
            next();
        }
    } catch (error) {
        res.status(Response.HTTP_UNAUTHORIZED).json({error: error | 'Unauthorized request'});
    }
}