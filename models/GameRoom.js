const Mongoose = require('mongoose')
const Schema   = Mongoose.Schema

const GameRoomSchema = new Mongoose.Schema(
{
    roomId: {
        type: String,
        unique:true,
        required: true,
    },
    roomInfo: { type: Schema.Types.ObjectId, ref: 'GameRoomInfo' },
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
        default: 'waiting'
    },
    createdAt: { type: Date, default: Date.now },
    expireAt: { type: Date, default: undefined },
}, { versionKey: false })

GameRoomSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 0 });

module.exports = Mongoose.model('GameRoom' , GameRoomSchema)