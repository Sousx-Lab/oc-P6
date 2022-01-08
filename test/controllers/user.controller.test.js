const app = require('../../app');
const request = require('supertest');
const httpResponse = require('../../middleware/http/http.response');
const dataBase = require('../../middleware/database/database');
const User = require('../../models/User');

const userRoute = {
    signup: "/api/auth/signup",
    login: "/api/auth/login"
};

/** Dropping DB users before all tests.*/
beforeAll(async () =>{
    await dataBase.dropModel(User);
});

describe('sign up', () => {
    it('returns status code 400 if email is blank', async () => {
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
            password: ""
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

 /** Closing the DB connection allows Jest to exit successfully.*/
afterAll(async () =>{
    await dataBase.close();
  });
  