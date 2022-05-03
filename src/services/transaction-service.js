//Business logic to handle transactions related functionalities
const transactionOperation  = require("../dao/operations/transaction-operation.js");
const cashBackService = require("./cashback-service");
const response = require('../util/response');

class TransactionService {  

    //function to add the transaction to database.
    upsert = async(inputData)=>{
        try{
            // check whether transaction already exists. Then add/update based on input.
            const transactionResult = await (new transactionOperation()).upsert(inputData);
            
            if(transactionResult){
                await (new cashBackService()).calculateCashback(transactionResult); // add cashbacks
                return new response().created(transactionResult);
            
            }else{
                console.log("Error in adding transaction details");
                throw new response().internalServerError(exception);
            }
            
        }catch(exception){
            console.log("Error while trying to add transaction to database",{exception});
            throw new response().internalServerError(exception);
        }
    }

}


module.exports = TransactionService;