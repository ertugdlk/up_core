const Mongoose = require('mongoose')
const _ = require('lodash')
const Schema = Mongoose.Schema
const moment = require('moment')

const message = new Mongoose.Schema(
    {
        nickname: {
            type: String,
            required: true
        },
        message: {
            type: String
        },
        sentAt: { type: Date, required: true, default: Date.now },
    }, { versionKey: false, _id: false }
)

const ChatHistorySchema = new Mongoose.Schema({
    room: { type: Schema.Types.ObjectId, ref: 'GameRoom' },
    createdAt: { type: Date, expires: 604800, default: Date.now },
    messages: [message],
}, { versionKey: false })

//ChatHistorySchema.index({ 'createdAt': 1 }, { expireAfterSeconds: 604800 });

module.exports = Mongoose.model('ChatHistory', ChatHistorySchema)