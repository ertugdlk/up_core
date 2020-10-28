const Mongoose = require('mongoose')
const _ = require('lodash')

const PlatformSchema = new Mongoose.Schema(
    {
        "name": { type: String, required: true, unique:true},
    },
    {versionKey: false}
)

module.exports = Mongoose.model('Platform', PlatformSchema)