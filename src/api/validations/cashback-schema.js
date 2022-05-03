const Joi = require('joi');

// Input validation schema for ruleset
const getCashbackSchema = Joi.object({
    limit: Joi.number().integer().optional().greater(0),
    offset: Joi.number().integer().optional(),
});


module.exports = {getCashbackSchema}