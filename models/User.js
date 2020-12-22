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
        minlength: 4
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!Validator.isEmail(value)) {
                throw new Error({ error: 'Invalid Email address' })
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    emailVerified: {
        type: Boolean,
        default: false
    }
})

userModel.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userModel.methods.generateAuthToken = async function () {
    // Generate an auth token for the userId
    this.password = ''
    const accessToken = await JWTUtil.sign(this, Config.get('jwt'))
    return accessToken
}

userModel.methods.findByCredentials = async function (password) {
    const isPasswordMatch = await bcrypt.compare(password, this.password)
    if (isPasswordMatch === false) {
        return false
    }
    else {
        return true
    }
}

module.exports = Mongoose.model('User', userModel)