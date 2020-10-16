const _ = require('lodash')
const Mongoose = require('mongoose')
const User = require('./User')
const Schema   = Mongoose.Schema
const bcrypt = require('bcrypt')

const CredentialsSchema = new Mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    identityID: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        validate: {
          validator: function(v) {
            return /\d{3}-\d{3}-\d{4}/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    }
})

CredentialsSchema.pre('save', async function () {
    const credentials = this
    if (credentials.isModified('identityID')) {
        credentials.identityID = await bcrypt.hash(credentials.identityID, 9)
    }
    next()
})

module.exports = Mongoose.model('Credential', CredentialsSchema)