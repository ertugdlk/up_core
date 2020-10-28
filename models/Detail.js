const Mongoose = require('mongoose')
const _ = require('lodash')

const DetailSchema = Mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    platform: { type: Schema.Types.ObjectId, ref: 'Platform' },
    name: {
        type:String,
        trim:true
    },
    uniqueID: { 
        type: String,
        required: true
    }
}, {versionKey: false})

module.exports = Mongoose.model('Detail' , DetailSchema)