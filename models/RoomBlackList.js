const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const balckListedUser = new Mongoose.Schema(
    {
        nickname: {
            type: String,
            required: true
        },

    }, { versionKey: false, _id: false }
)

const RoomBlackListSchema = new Mongoose.Schema({
    room: { type: Schema.Types.ObjectId, ref: 'GameRoom' },
    users: [balckListedUser],
}, { versionKey: false })

module.exports = Mongoose.model('RoomBlackList', RoomBlackListSchema)