const Mongoose = require('mongoose')
const _ = require('lodash')
const Schema = Mongoose.Schema

const DetailSchema = new Mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    platform: { type: Schema.Types.ObjectId, ref: 'Platform' },
    avatar: {
        type: String
    },
    name: {
        type: String,
        trim: true
    },
    uniqueID: {
        type: String,
        required: true
    },
    games: [
        {
            _id: false,
            id: { type: Schema.Types.ObjectId, ref: 'Game' },
            ign: { type: String },
        }
    ]
}, { versionKey: false })

//Pre save control
DetailSchema.pre('save', async function (next) {
    const Detail = Mongoose.model('Detail', DetailSchema)
    const filteredDetail = await Detail.findOne({ user: this.user, platform: this.platform })

    if (filteredDetail) {
        throw new error({ error: 'Exist Detail for this platform and user' })
    }
    else {
        next()
    }
})

module.exports = Mongoose.model('Detail', DetailSchema)