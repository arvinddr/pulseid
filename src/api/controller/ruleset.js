const {inputValidation} = require('../validations/index.js');
const {addRulsetSchema} = require('../validations/ruleset-schema.js');
const rulesetService = require('../../services/ruleset-service.js');


async function addRuleset(req,res){
    try{
        const inputData = inputValidation(addRulsetSchema,{...req.body});
        
        //add the ruleset from service.
        const result = await  (new rulesetService()).add(inputData);
        res.status(result.httpCode).send();

    }catch(exception){
        console.log('Error while trying to add rulset',{exception});
        res.status(exception.httpCode).send(exception);
    }
}

module.exports =  {addRuleset};