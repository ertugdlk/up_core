const mongoose = require('mongoose')
const UserModel = require('../models/User')
const date = new Date()
date.setFullYear(1998,4,13)
const userData = { nickname: 'phybarin', email: 'ertgdlk@gmail.com',
 password:'123456' , dateOfBirth:date }
const bcrypt = require('bcrypt')

describe('User Model Test', () => {
    //connect to the mongoDB memory server 
    //using mongoose.connect
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
        })
    })

    it('create & save user successfully', async () => {
        const validUser = new UserModel(userData)
        const savedUser = await validUser.save()
        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedUser._id).toBeDefined()
        expect(savedUser.email).toBe(userData.email)
        expect(savedUser.nickname).toBe(userData.nickname)
    });
    
    it('insert user successfully, undefined fields should be undefined', async () => {
        const userWithInvalidField = new UserModel({ nickname: 'kaygan', email: 'ozanezer@gmail.com',
        password:'123456', gender:'male', dateOfBirth: date})
        const savedUserWithInvalidField = await userWithInvalidField.save()
        expect(savedUserWithInvalidField._id).toBeDefined()
        expect(savedUserWithInvalidField.gender).toBeUndefined()
    })

    
    it('insert user without required field should be error', async() => {
        const userWithoutRequiredField = new UserModel({email:'ercebekture@gmail.com', password:'123456', dateOfBirth: date})
        let err

        try
        {
            const savedUser = await userWithoutRequiredField.save()
            error = savedUser
        }
        catch(error)
        {
            err = error
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        expect(err.errors.nickname).toBeDefined()
    })

    
    it('When user created user password decryption works or not', async() => {
        const user = await new UserModel({nickname:'berkanny', email:'berkanyuksel@gmail.com', password:'123456', dateOfBirth: date})
        const savedUser = await user.save()
        var boolError
        const isPasswordMatch = bcrypt.compare(user.password , savedUser.password)

        if(!isPasswordMatch)
        {
            boolError = false
        }
        else
        {
            boolError = true
        }

        expect(boolError).toBe(true)
    })
    
})