const mongoose = require("mongoose");

const CashBackSchema = new mongoose.Schema({
    transactionId: {
        type: Number,
        required: true,
    },
    amount: {
        type: mongoose.Decimal128,
        required: true,
        get:getAmount
    },
    id: false
},{toJSON: {getters: true}});

const CashBack = mongoose.model("CashBack", CashBackSchema);

function getAmount(value) {
    if (typeof value !== 'undefined') {
       return parseFloat(value.toString());
    }
    return value;
}

module.exports = {CashBack};