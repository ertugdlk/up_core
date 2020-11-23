const Mongoose = require('mongoose')

const GameRoomSchema = new Mongoose.Schema(
{
    roomId: {
        type: String,
        unique:true,
        required: true,
    },
    host:{
        type: String,
        unique: true,
        require: true
    },
    users: [{
        type: String,
    }],
    status: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    expireAt: { type: Date, default: undefined },
}, { versionKey: false })

GameRoomSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 0 });

module.exports = Mongoose.model('GameRoom' , GameRoomSchema)