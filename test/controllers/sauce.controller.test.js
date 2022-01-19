const app = require('../../app');
const request = require('supertest');
const httpResponse = require('../../middleware/http/http.response');
const dataBase = require('../../middleware/database/database');
const User = require('../../models/User');
const Sauce = require('../../models/Sauce');
const { needUser, needAuthorizationToken } = require('./needUser');
const { needFixtures } = require ('./needFixtures');
const path = require('path');

const sauceRoute = {
    /**Route Get all or Post new sauce */
    getAllOrPost: "/api/sauces/",
    
    /** Route Get, Put, Delete sauce */
    getPutDeleteOne: id => {return `/api/sauces/${id}`},

    /**Route like sauce */
    like: id => {return `/api/sauces/${id}/like`}
};

let token = null;
let sauces = null;
let user = null;

/** 
 * Dropping DB & create new fixtures before all tests.
 */
beforeAll(async () =>{   
    user = await needUser();
    const newToken = needAuthorizationToken(user);
    token = newToken.token;
    sauces = await needFixtures(user);
});

/** 
 * GetAll controller tests
 */
describe('Get All saucse controller tests ', () => {
    
    it('Get all sauces returns status code 401 if no authenticated user', async () => {
        const res = await request(app)
        .get(sauceRoute.getAllOrPost);
        expect(res.statusCode).toEqual(httpResponse.HTTP_UNAUTHORIZED);
    });
    
    it('Get all sauces returns status code 200 and json sauces if authenticated user', async () => {
        const res = await request(app)
        .get(sauceRoute.getAllOrPost)
        .set('Authorization','Bearer ' + token);
        expect(res.statusCode).toEqual(httpResponse.HTTP_OK);
        expect(res.body[0]._id).toMatch(sauces[0].id);
        
    });
});

/**
 * GetOne sauce controller tests
 */
describe('Get One sauce controller test', () => {
    
    it('Get one sauce returns status code 401 if no authenticated user', async () => {
        const res = await request(app)
        .get(sauceRoute.getPutDeleteOne(sauces[0].id))
        expect(res.statusCode).toEqual(httpResponse.HTTP_UNAUTHORIZED);
    });

    it('Get one sauce returns status code 200 and json sauce if authenticated user', async () => {
        const res = await request(app)
        .get(sauceRoute.getPutDeleteOne(sauces[0].id))
        .set('Authorization','Bearer ' + token);
        expect(res.statusCode).toEqual(httpResponse.HTTP_OK);
        expect(res.body._id).toMatch(sauces[0].id);
    });
})

/**
 * Create new sauce controller tests
 */
describe('Create new sauces controler test ', () =>{
    it('Post new sauce returns status code 401 if no authenticated user', async () => {
        const res = await request(app)
        .post(sauceRoute.getAllOrPost)
        .send({
            userId: 1,
            name: "NewSauce",
            manufacturer: "SuperManufacturer",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            mainPepper: "Red hot chili peppers",
            heat: 5,
        })
        expect(res.statusCode).toEqual(httpResponse.HTTP_UNAUTHORIZED);
    });

    it('Post new sauce returns status code 201 if authenticated user', async () => {
        const res = await request(app)
        .post(sauceRoute.getAllOrPost)
        .set('Authorization','Bearer ' + token)
        .field('sauce', JSON.stringify({
            userId: user.id,
            name: "New Sauce",
            manufacturer: "SuperManufacturer",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            mainPepper: "Red hot chili peppers",
            heat: 5,
        }))
        .attach('image', path.resolve(__dirname, './hot_sauce.jpg'))
       
        expect(res.statusCode).toEqual(httpResponse.HTTP_CREATED);
    });
});
/**
 * Modify sauce controller tests
 */
describe('Modifiy sauce controller test', () => {
    it('Modify sauce returns status code 401 if no authenticated user', async () => {
        const res = await request(app)
        .put(sauceRoute.getPutDeleteOne(sauces[0].id))
        expect(res.statusCode).toEqual(httpResponse.HTTP_UNAUTHORIZED);
    });

    it('Modify sauce returns status code 401 if user is not the owner of object', async () => {
        const res = await request(app)
        .put(sauceRoute.getPutDeleteOne(sauces[0].id))
        .set('Authorization','Bearer ' + token)
        .field('sauce', JSON.stringify({
            userId: user.id,
            name: "Modified Sauce",
            manufacturer: "SuperManufacturer",
            description: "Lorem ipsum dolor sit amet.",
            mainPepper: "Red hot chili peppers",
            heat: 6,
        }))
        .attach('image', path.resolve(__dirname, './hot_sauce.jpg'))
       
        expect(res.statusCode).toEqual(httpResponse.HTTP_UNAUTHORIZED);
    });

    it('Modify sauce returns status code 200 if user is owner of object', async () => {
        const res = await request(app)
        .put(sauceRoute.getPutDeleteOne(sauces[3].id))
        .set('Authorization','Bearer ' + token)
        .field('sauce', JSON.stringify({
            userId: user.id,
            name: "Modified Sauce",
            manufacturer: "SuperManufacturer",
            description: "Lorem ipsum dolor sit amet.",
            mainPepper: "Red hot chili peppers",
            heat: 6,
        }))
        .attach('image', path.resolve(__dirname, './hot_sauce.jpg'))
       
        expect(res.statusCode).toEqual(httpResponse.HTTP_OK);
    });
});

/**
 * Delete sauce controller tests
 */
describe('Delete sauce controller test', () => {
    it('Delete sauce returns status code 401 if no authenticated user', async () => { 
        const res = await request(app)
        .del(sauceRoute.getPutDeleteOne(sauces[0].id))
        expect(res.statusCode).toEqual(httpResponse.HTTP_UNAUTHORIZED);
    });

    it('Delete sauce returns status code 401 if user is not the owner of object', async () => {
        const res = await request(app)
        .del(sauceRoute.getPutDeleteOne(sauces[0].id))
        .set('Authorization','Bearer ' + token)
        expect(res.statusCode).toEqual(httpResponse.HTTP_UNAUTHORIZED);
    });

    it('Delete sauce returns status code 200 if user is not the owner of object', async () => {
        const res = await request(app)
        .del(sauceRoute.getPutDeleteOne(sauces[3].id))
        .set('Authorization','Bearer ' + token);
        expect(res.statusCode).toEqual(httpResponse.HTTP_OK);
    });
});

/**
 * Like unlike controller tests 
 */
describe('Like unlike sauce controller test', () => {
    beforeAll(async () =>{   
        user = await needUser();
        const newToken = needAuthorizationToken(user);
        token = newToken.token;
        sauces = await needFixtures(user);
    });
    
    it('Like / Unlike sauce returns status code 401 if no authenticated user', async () => {
        const res = await request(app)
        .post(sauceRoute.like(sauces[0].id))
        expect(res.statusCode).toEqual(httpResponse.HTTP_UNAUTHORIZED);
    });

    it('Like sauce returns status code 200 if authenticated user', async () => {
        const res = await request(app)
        .post(sauceRoute.like(sauces[4].id))
        .set('Authorization','Bearer ' + token)
        .send({
            like: 1,
            userId: user.id
        })
        expect(res.statusCode).toEqual(httpResponse.HTTP_OK);
    });

    it('Unlike sauce returns status code 200 if authenticated user', async () => {
        const res = await request(app)
        .post(sauceRoute.like(sauces[4].id))
        .set('Authorization','Bearer ' + token)
        .send({
            like: -1,
            userId: user.id
        })
        expect(res.statusCode).toEqual(httpResponse.HTTP_OK);
    });

    it('Cancel like/unlike sauce returns status code 200 if authenticated user', async () => {
        const res = await request(app)
        .post(sauceRoute.like(sauces[4].id))
        .set('Authorization','Bearer ' + token)
        .send({
            like: 0,
            userId: user.id
        })
        expect(res.statusCode).toEqual(httpResponse.HTTP_OK);
    });
});

 /** Closing the DB connection allows Jest to exit successfully.*/
afterAll(async () =>{
    await dataBase.disconnect();
})