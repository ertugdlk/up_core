const mongoose = require('mongoose');
const UserModel = require('../models/User');
const userData = { nickname: 'phybarin', name: 'Ertuğ', surname:'Dilek', email: 'ertgdlk@gmail.com',
 password:'123456' }
const bcrypt = require('bcrypt')

describe('User Model Test', () => {

    // It's just so easy to connect to the MongoDB Memory Server 
    // By using mongoose.connect
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
        });
    });

    it('create & save user successfully', async () => {
        const validUser = new UserModel(userData)
        const savedUser = await validUser.save()
        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedUser._id).toBeDefined()
        expect(savedUser.name).toBe(userData.name)
        expect(savedUser.surname).toBe(userData.surname)
        expect(savedUser.email).toBe(userData.email)
    });
})