const _ = require('lodash')
const Mongoose = require('mongoose')
const User = require('./User')
const Schema = Mongoose.Schema
const bcrypt = require('bcrypt')
const { encrypt, decrypt } = require('../utils/Cryptoutil')

const CredentialsSchema = new Mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    identityID: {
        iv: { type: String, },
        content: { type: String, unique: true }
    },
    phone: {
        type: String,
        required: [true, 'User phone number required'],
        unique: true
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
    dateOfBirth: {
        type: Date,
        required: true,
        trim: true,
    }
})

CredentialsSchema.post('save', async function () {
    await User.findOneAndUpdate({ _id: this.user }, { isVerified: true })
})

module.exports = Mongoose.model('Credential', CredentialsSchema)