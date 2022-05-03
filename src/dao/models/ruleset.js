const mongoose = require("mongoose");

const RuleSetSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    cashback:{
        type: mongoose.Decimal128,
        required: true,
        get: getBudget
    },
    redemptionLimit:{
        type: Number,
        required: false
    },
    minTransactions:{
        type: Number,
        required: false
    },
    budget:{
        type: mongoose.Decimal128,
        required: false,
        get: getBudget
    },
    id: false
},{toJSON: {getters: true}});

const RuleSet = mongoose.model("RuleSet", RuleSetSchema);

function getBudget(value) {
    if (typeof value !== 'undefined') {
       return parseFloat(value.toString());
    }
    return value;
}


module.exports= {RuleSet};