//Business logic to handle ruleset related functionalities
const ruleSetOperation = require("../dao/operations/ruleset-operation.js");
const response = require('../util/response');


class RulesetService {  

    //function to add the ruleset to database.
    add = async(inputData)=>{
        try{
            const result =  await (new ruleSetOperation()).add(inputData);
            return new response().created(result);
        }catch(exception){
            console.log("Error while trying to add ruleset to database",{exception});
            throw new response().internalServerError(exception);
        }
    }
}


module.exports =  RulesetService;