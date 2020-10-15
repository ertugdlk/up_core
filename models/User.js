const Mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Validator = require('validator')
const Config = require('config')
const JWTUtil = require('../utils/JWTutil')

const userModel = new Mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    surname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
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
})

userModel.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userModel.methods.generateAuthToken = async function() {
    // Generate an auth token for the userId
    const accessToken = await JWTUtil.sign(this, Config.get('jwt'))
    return accessToken
}

userModel.methods.findByCredentials = async function(password)
{
    const isPasswordMatch = bcrypt.compare(password , this.password)
    if(!isPasswordMatch)
    {
        throw new error ({error:'Invalid'})
    }
    else
    {
        return true
    }
}

module.exports = Mongoose.model('User', userModel)