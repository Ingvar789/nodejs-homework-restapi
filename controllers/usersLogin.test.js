/*
1. Get email and password in string.
2. Return status, user name, user email and token.
3. Throw errors with valid message if it was given bad args.

"legolas@gmail.com", "1234567" => res.status = 200
"legolas@gmail.com", "1234568" => res.status = 404
if one of email or pass or both are not string = 404
"legolas@gmail.com", "1234567" => res.token is String
 */

const axios = require('axios');

describe("test controllerLogin function", ()=> {

    test("response - 200", async ()=> {
        const response = await axios.post('http://localhost:3001/users/login',
            {
                "email":"legolas@gmail.com",
                "password": "1234567"
            });
        expect(response.status).toBe(200);
    });

    test("response have token", async ()=> {
        const response = await axios.post('http://localhost:3001/users/login',
            {
                "email":"legolas@gmail.com",
                "password": "1234567"
            });
        expect(response.data).toHaveProperty('token');
    });

    test("response token is string", async ()=> {
        const response = await axios.post('http://localhost:3001/users/login',
            {
                "email":"legolas@gmail.com",
                "password": "1234567"
            });
        expect(typeof response.data.token).toBe('string');
    });

    test("wrong incoming data", async ()=> {
        const response = await axios.post('http://localhost:3001/users/login',
            {
                "email":"legolas@gmail.com",
                "password": "1234568"
            });
        expect (response.status).toBe(401);
    });

    test("email and password must be string", async ()=> {
        const response = await axios.post('http://localhost:3001/users/login',
            {
                "email":123,
                "password": 123
            })
        expect(response.status).toBe(400);
    });

    test("response have property 'user' ", async ()=> {
        const response = await axios.post('http://localhost:3001/users/login',
            {
                "email":"legolas@gmail.com",
                "password": "1234567"
            })
        expect(response.data).toHaveProperty('user');
    });

    test("user is an object", async ()=> {
        const response = await axios.post('http://localhost:3001/users/login',
            {
                "email":"legolas@gmail.com",
                "password": "1234567"
            })
        expect(typeof response.data.user).toBe('object');
    });

    test("user have key 'email' ", async ()=> {
        const response = await axios.post('http://localhost:3001/users/login',
            {
                "email":"legolas@gmail.com",
                "password": "1234567"
            })
        expect(response.data.user).toHaveProperty('email');
    });

    test("user have key 'subscription' ", async ()=> {
        const response = await axios.post('http://localhost:3001/users/login',
            {
                "email":"legolas@gmail.com",
                "password": "1234567"
            })
        expect(response.data.user).toHaveProperty('subscription');
    });

    test(" email is string ", async ()=> {
        const response = await axios.post('http://localhost:3001/users/login',
            {
                "email":"legolas@gmail.com",
                "password": "1234567"
            })
        expect(typeof response.data.user.email).toBe('string');
    });

    test("subscription is string", async ()=> {
        const response = await axios.post('http://localhost:3001/users/login',
            {
                "email":"legolas@gmail.com",
                "password": "1234567"
            })
        expect(typeof response.data.user.subscription).toBe('string');
    });
})