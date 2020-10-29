const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const GameSchema = new Mongoose.Schema({
    platform: { type: Schema.Types.ObjectId, ref: 'Platform' },
    name: {
        type:String,
        trim:true,
        required: true
    },
    appID: { 
        type: String,
        required: true
    }
}, {versionKey: false})

module.exports = Mongoose.model('Game', GameSchema)