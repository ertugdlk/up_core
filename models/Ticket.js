const Mongoose = require('mongoose')
const Schema = Mongoose.Schema


const TicketSchema = new Mongoose.Schema({
    reporter: { type: String, required: true },
    reported: { type: String, required: true },
    room_id: { type: String },
    createdAt: { type: Date, default: Date.now },
    reportType: [String],
    message: { type: String },
    status: { type: String, default: "Waiting" }
}, { versionKey: false })


module.exports = Mongoose.model('Ticket', TicketSchema)

