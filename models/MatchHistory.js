const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomUser = new mongoose.Schema(
    {
        nickname: {
            type: String,
            required: true
        },
        team: {
            type: Number
        }
    }, { versionKey: false, _id: false }
)


const MatchHistorySchema = new mongoose.Schema({
    matchId: {
        type: String,
        trim: true,
        required: true
    },
    team1Score: {
        type: Number,
        trim: true,
        required: true
    },
    team2Score: {
        type: Number,
        trim: true,
        required: true
    },
    winner: {
        type: String,
        required: true,
    },
    reward: {
        type: Number
    },
    users: [roomUser],


}, { versionKey: false })

module.exports = mongoose.model('MatchHistory', MatchHistorySchema)