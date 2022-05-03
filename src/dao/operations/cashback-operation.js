const {CashBack} = require('../models/cashback.js');

class CashBackOperation {
    upsert = async(inputData,session)=>{
        try{
            return CashBack.findOneAndUpdate({
                transactionId: inputData.transactionId
            }, inputData, { upsert: true,new: true}).session(session);

        }catch(exception){
            console.log(`Exception while adding CashBack record`,exception);
            throw new Error('Exception in adding CashBack to db');
        }
    }

    list = async(page,pageSize)=>{
        try{
            const skipEntries = page? page * pageSize:0;

            return CashBack.find({}).select({'transactionId':1,'amount':1,'_id':0})
                .limit(pageSize)
                .skip(skipEntries)
                .sort({
                    transactionId: 'asc'
                })
        }catch(exception){
            console.log(`Exception while listing CashBacks`,exception);
            throw new Error('Exception while listing CashBacks from db');
        }
    }
}

module.exports =  CashBackOperation;