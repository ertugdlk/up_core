const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const BalanceSchema = new Mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    balance: {
        type: Number,
        required: true,
        default: 0
    }
}, { versionKey: false })

module.exports = Mongoose.model('Game', GameSchema)


//bool ignNeeded oyunun ign gerektirip gerektirmediği 