// Function to validate the input data for APIS.
const response = require('../../util/response');

const inputValidation = (schema,inputData)=>{
    const { error, value } = schema.validate(inputData);

    if(error){
        console.log("Input validation error", {error});
        throw new response().badRequest((new Error(JSON.stringify(error.details))));
    }
    return value;
} 

module.exports = {inputValidation}