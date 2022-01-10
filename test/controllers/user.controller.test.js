const app = require('../../app');
const request = require('supertest');
const httpResponse = require('../../middleware/http/http.response');
const dataBase = require('../../middleware/database/database');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const {needUser} = require('./needUser');

const userRoute = {
    signup: "/api/auth/signup",
    login: "/api/auth/login"
};

/** Dropping DB users before all tests.*/
beforeAll(async () =>{
    await dataBase.dropModel(User);
});

/** 
 * SignUp Tests  
 */
describe('sign up', () => {
    it('returns status code 400 if email is empty', async () => {
        const res = await request(app)
        .post(userRoute.signup)
        .send({
            email: "",
            password: "password"
        });
        expect(res.statusCode).toEqual(httpResponse.HTTP_BAD_REQUEST);
    });

    it('returns status code 400 if email is not valid', async () => {
        const res = await request(app)
        .post(userRoute.signup)
        .send({
            email: "not@validEmailCom",
            password: "password"
        });
        expect(res.statusCode).toEqual(httpResponse.HTTP_BAD_REQUEST);
    });

    it('returns status code 400 if password is empty', async () => {
        const res = await request(app)
        .post(userRoute.signup)
        .send({
            email: "email@domain.com",
            password: " "
        });
        expect(res.statusCode).toEqual(httpResponse.HTTP_BAD_REQUEST);
    });

    it("returns status code 201 and create user with message `L'utilisateur a bien été créé !`", async () => {
        const res = await request(app)
        .post(userRoute.signup)
        .send({
            email: "email@domain.com",
            password: "password"
        });
        expect(res.statusCode).toEqual(httpResponse.HTTP_CREATED);
        expect(res.body.message).toEqual("L'utilisateur a bien été créé !");
    });
   
});

/**
 * Login Tests 
*/
describe('login', () => {
    
    it("returns status code 401 if email not match", async () =>{
        const res = await request(app)
        .post(userRoute.login)
        .send({
            email: " ",
            password: "password"
        });
        expect(res.statusCode).toEqual(httpResponse.HTTP_UNAUTHORIZED);

    });

    it("returns status code 401 if password not match", async () =>{
        const res = await request(app)
        .post(userRoute.login)
        .send({
            email: "email@test.com",
            password: " "
        });
        expect(res.statusCode).toEqual(httpResponse.HTTP_UNAUTHORIZED);

    });

    it("returns status code 200 and JWToken if user succesfully authentificated", async () =>{
        const newUser = {email: 'email@test.com', password: 'passwordTest'}

        await dataBase.dropModel(User)
        .then(async () => {
        await request(app)
        .post(userRoute.signup)
        .send(newUser)

        }).then(async() => {
            const res = await request(app)
            .post(userRoute.login)
            .send(newUser);
        expect(res.statusCode).toEqual(httpResponse.HTTP_OK);
        })  
    });

});

 /** Closing the DB connection allows Jest to exit successfully.*/
afterAll(async () =>{
    await dataBase.disconnect()
});
  