const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const BalanceSchema = new Mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    balanceOnHold: {
        type: Number,
        default:0
    }
}, { versionKey: false })

module.exports = Mongoose.model('Balance', BalanceSchema)


//bool ignNeeded oyunun ign gerektirip gerektirmediği 