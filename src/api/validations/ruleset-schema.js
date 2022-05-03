const Joi  = require('joi');

// Input validation schema for ruleset
 const addRulsetSchema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    cashback: Joi.number().required(),
    redemptionLimit: Joi.number().integer().optional(),
    minTransactions: Joi.number().integer().optional(),
    budget: Joi.number().optional()
});


module.exports = {addRulsetSchema}