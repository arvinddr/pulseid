const {Transaction} = require('../models/transaction.js');

class TransactionOperation {
    upsert = async(inputData)=>{
        try{
           return Transaction.findOneAndUpdate({
                id: inputData.id
            }, inputData, { upsert: true,new: true});


        }catch(exception){
            console.log(`Exception while adding transaction record`,exception);
            throw new Error('Exception in adding transaction to db');
        }
    }

    // function to compute the number of transaction performed by customer.
    getNumberOfTransactions = async(customerId)=>{
        try{
            return Transaction.aggregate([
                {
                    $match: {
                        customerId: customerId
                    }
                },
                {
                    $count: "numberOfTransactions"
                }
            ]);
 
         }catch(exception){
             console.log(`Exception while getting number of transactions`,exception);
             throw new Error('Exception while getting number of transactions');
         }
    }
}

module.exports = TransactionOperation;