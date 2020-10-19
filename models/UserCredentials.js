const _ = require('lodash')
const Mongoose = require('mongoose')
const User = require('./User')
const Schema   = Mongoose.Schema
const bcrypt = require('bcrypt')
const {encrypt, decrypt} = require('../utils/Cryptoutil')

const CredentialsSchema = new Mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    identityID: {
        iv:{type: String,},
        content:{type: String,}
    },
    phone: {
        type: String,
        required: [true, 'User phone number required']
    }
})

module.exports = Mongoose.model('Credential', CredentialsSchema)