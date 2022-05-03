const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
    customerId:{
        type: Number,
        required: false
    }
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = {Transaction}