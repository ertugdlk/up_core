const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Validator = require('validator')

const userModel = mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: value => {
            if (!Validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email address'})
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    /*
    phone: {
        type: String,
        validate: {
                validator: function(v) {
                    return /\d{3}-\d{3}-\d{4}/.test(v)
                },
                message: props => `${props.value} is not a valid phone number!`
            },
            required: [true, 'User phone number required']
    },*/
})

const User = mongoose.model('User', userModel)
module.exports = User