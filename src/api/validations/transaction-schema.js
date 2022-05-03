const Joi = require('joi');

// Input validation schema for transaction
const addTransactionSchema = Joi.object({
    date: Joi.date().required(),
    id: Joi.number().integer().required().greater(0),
    customerId:  Joi.number().integer().optional().greater(0)
});

module.exports = {addTransactionSchema};