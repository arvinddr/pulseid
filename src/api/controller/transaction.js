const {inputValidation} =require('../validations/index.js');
const {addTransactionSchema} = require('../validations/transaction-schema.js');
const transactionService = require('../../services/transaction-service.js');

async function addTransaction(req,res){
    try{
        const inputData = inputValidation(addTransactionSchema,{...req.body});
        
        //add the transaction from service.
        const result = await (new transactionService()).upsert(inputData);
        res.status(result.httpCode).send();

    }catch(exception){
        console.log('Error while trying to add transaction',{exception});
        res.status(exception.httpCode).send(exception);
    }
}

module.exports = {addTransaction};