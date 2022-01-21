require('dotenv-flow').config();
const jsonWebToken = require('../../../middleware/security/jwt');

let user = {
    id: '123456789',
    email: 'emailtest@domain.com',
    password: 'hashedPassword'
};

describe('jwtSign tests', () => {
    it('throw error if user object id is undefined or null', () => {
        delete user.id;
        expect(() => {
            const token = jsonWebToken.jwtSign(user)
          }).toThrow("User must be a object with id and email property");

        user.id = '';
        expect(() => {
            const token = jsonWebToken.jwtSign(user)
          }).toThrow("User must be a object with id and email property"); 
    })

    it('throw error if user object email is undefined or null', () => {
        delete user.email;

        expect(() => {
            const token = jsonWebToken.jwtSign(user)
        }).toThrow("User must be a object with id and email property"); 
        
        user.email = '';
        expect(() => {
            const token = jsonWebToken.jwtSign(user)
        }).toThrow("User must be a object with id and email property"); 
    });

    it('returns json web token', () => {
        user = {
            id: '123456789',
            email: 'emailtest@domain.com',
            password: 'hashedPassword'
        };
        const token = jsonWebToken.jwtSign(user)
        expect(token).toMatchObject({userId: user.id});
    })
});

describe('jwtVerify tests', () => {
    it("throw error if token is null", () => {
        expect(() => {
            jsonWebToken.jwtVerify("")
          }).toThrow("Token must be a Json Web Token valid");
    })

    it("returns user object", () => {
        user = {
            id: '123456789',
            email: 'emailtest@domain.com',
            password: 'hashedPassword'
        };
        const signedUser = jsonWebToken.jwtSign(user);
        const decodedToken = jsonWebToken.jwtVerify(signedUser.token)
        expect(decodedToken).toMatchObject({userId: user.id})
    })
})
