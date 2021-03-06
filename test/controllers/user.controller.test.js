const app = require('../../app');
const request = require('supertest');
const httpResponse = require('../../middleware/http/http.response');
const dataBase = require('../../middleware/database/database');
const User = require('../../models/User');
const {needUser} = require('./needUser');

const userRoute = {
    signup: "/api/auth/signup",
    login: "/api/auth/login"
};

/** Dropping DB users before all tests.*/
beforeAll(async () =>{
    await User.deleteMany({})
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
            password: "passwordTest1"
        });
        expect(res.statusCode).toEqual(httpResponse.HTTP_BAD_REQUEST);
    });

    it('returns status code 400 if email is not valid', async () => {
        const res = await request(app)
        .post(userRoute.signup)
        .send({
            email: "not@validEmailCom",
            password: "passwordTest1"
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

    it('returns status code 400 if password not match requirement', async () => {
        const res = await request(app)
        .post(userRoute.signup)
        .send({
            email: "email@domain.com",
            password: "notmatchpassword"
        });
        expect(res.statusCode).toEqual(httpResponse.HTTP_BAD_REQUEST);
    });
    
    it("returns status code 201 and create user with message `The user has been successfully created !`", async () => {
        const res = await request(app)
        .post(userRoute.signup)
        .send({
            email: "email@domain.com",
            password: "passwordTest1"
        });
        expect(res.statusCode).toEqual(httpResponse.HTTP_CREATED);
        expect(res.body.message).toEqual("The user has been successfully created !");
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
        expect(res.statusCode).toEqual(httpResponse.HTTP_BAD_REQUEST);

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
        
        const newUser = await needUser();
        const res = await request(app)
            .post(userRoute.login)
            .send({email: newUser.email, password: 'PasswordTest1'});
        expect(res.statusCode).toEqual(httpResponse.HTTP_OK);
        
    });

});

 /** Closing the DB connection allows Jest to exit successfully.*/
afterAll(async () =>{
    await dataBase.disconnect()
});
  