const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const roomUser = new Mongoose.Schema(
    {
        nickname: {
            type: String,
            required: true
        },
        team: {
            type: Number
        },
        readyStatus: {
            type: Boolean,
            default: 0
        }
    }, { versionKey: false, _id: false }
)

const GameSettings = new Mongoose.Schema(
    {
        map: {
            type: String
        },
        type: {
            type: String
        }
    }, { versionKey: false, _id: false }
)

const GameRoomSchema = new Mongoose.Schema(
    {
        roomId: {
            type: String,
            unique: true,
            required: true,
        },
        roomInfo: { type: Schema.Types.ObjectId, ref: 'GameRoomInfo' },
        host: {
            type: String,
            unique: true,
            required: true
        },
        users: [roomUser],
        team1: {
            type: Number,
            default: 1
        },
        team2: {
            type: Number,
            default: 0
        },
        settings: GameSettings,
        status: {
            type: String,
            required: true,
            default: 'waiting'
        },
        reward:{
            type: String,
        },
        createdAt: { type: Date, default: Date.now },
        expireAt: { type: Date, default: undefined, expires: 180 },
    }, { versionKey: false })

GameRoomSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 0 });

module.exports = Mongoose.model('GameRoom', GameRoomSchema)