const {inputValidation} = require('../validations/index.js');
const {getCashbackSchema} = require('../validations/cashback-schema.js');
const cashbackService = require('../../services/cashback-service.js');

async function getCashbacks(req,res){
    try{
        const inputData = inputValidation(getCashbackSchema,{...req.query});
        //get the casback from service.
        const result = await (new cashbackService()).list({...inputData});
       
        res.status(result.httpCode).send(result);

    }catch(exception){
        console.log('Error while trying to get the cashback details',exception.error);
        res.status(exception.httpCode).send(exception);
    }
}

module.exports =  {getCashbacks};