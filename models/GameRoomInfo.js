const Mongoose = require('mongoose')

const GameRoomInfoSchema = new Mongoose.Schema({
    appId:{
        type: String,
        required: true
    },
    type:
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
})

module.exports = Mongoose.model('GameRoomInfo' , GameRoomInfoSchema)