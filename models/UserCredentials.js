const _ = require('lodash')
const Mongoose = require('mongoose')
const User = require('./User')
const Schema   = Mongoose.Schema


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

module.exports = Mongoose.model('Credential', CredentialsSchema)