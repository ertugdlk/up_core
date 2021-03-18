const Mongoose = require('mongoose')
const Schema = Mongoose.Schema


const item = new Mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        quantity: {
            type:Number,
            required: true
        },
        description: {
            type: String
        }

    }, { versionKey: false, _id: false }
)

const TransactionSchema = new Mongoose.Schema({
    user:{ type: Schema.Types.ObjectId, ref: 'User' },
    cc_holder_name: { type: String, required: true },
    masked_cc_no: { type: String, required: true },
    currency_code: { type: String, required: true },
    invoice_id: { type: String, required: true },
    invoice_description: { type: String },
    total: { type: String, required: true },
    items:[item],
    status_msg: { type: String, default: "Waiting" },
    status_code:{ type: String, default: "0"},
    transaction_id: {type: String, required:true},
    createdAt: {type:Date, default:Date.now}

}, { versionKey: false })


module.exports = Mongoose.model('Ticket', TicketSchema)
/*
"cc_holder_name":"Taygun Alban",
    "cc_no":"5101521220087763",
    "expiry_month":"12",
    "expiry_year":"24",
    "cvv":"336",
    "currency_code":"TRY",
    "installments_number": 1,
    "invoice_id":"123458",
    "invoice_description":"Testing",
    "total":"0.10",
    "merchant_key":"$2y$10$Rv/hx97L85vyk75v8Q3Npuztx6SxP1NccuH6qte6Xmt4muN1lVXya",
    "items":[{"name":"TestItem","price":"0.10","quantity":1,"description":"Item test description"}],
    "name" : "Taygun",
    "surname" : "Alban",
    */