const Mongoose = require('mongoose')
const Schema   = Mongoose.Schema

const GameRoomInfoSchema = new Mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    room:{
        type: String,
        required: true
    },
    userCount:{
        type: Number,
        default: 1
    },
    type:
    {
        type: String,
        required: true
    },
    host:
    {
        type: String,
        required: true
    },
    map:{
        type: String,
        required: true
    },
    fee:{
        type: String,
        required: true

    },
    reward:{
        type: String,
        required: true

    },
    createdAt:{
        type: String,
        required: true

    },
},  {versionKey: false})

module.exports = Mongoose.model('GameRoomInfo' , GameRoomInfoSchema)