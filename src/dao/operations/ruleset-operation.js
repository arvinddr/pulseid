const {RuleSet} = require('../models/ruleset.js');

class RuleSetOperation {
    add = async(inputData)=>{
        try{
            return RuleSet.create(inputData);
        }catch(exception){
            console.log(`Exception while adding ruleset record`,exception);
            throw new Error('Exception in adding ruleset to db');
        }
    }
    
    list = async(filter,session)=>{
        try{
            return RuleSet.find(filter).session(session)
        }catch(exception){
            console.log(`Exception while listing ruleset`,exception);
            throw new Error('Exception while listing ruleset from db');
        }
    }

    update = async(inputData,session)=>{
        try{
            console.log(JSON.stringify(inputData))
            return RuleSet.findOneAndUpdate({
                _id: inputData._id
            }, inputData, { upsert: true,new: true}).session(session);
        }catch(exception){
            console.log(`Exception while updating ruleset record`,exception);
            throw new Error('Exception in updating ruleset to db');
        }
    }

    // function to get list of cashaback with no redemptionLimit.
    getRulesetWithoutRedemptionLimit = async(transactionDate)=>{
        const filter = {
            startDate: {
                $lte: transactionDate
            },
            endDate: {
                $gte: transactionDate
            },
            redemptionLimit: null,
            budget: null
        };
        // step 1: To filter the ruleset based on transaction date.
        const ruleSetList = await this.list(filter);

        if(!ruleSetList){
            return [];
        }
        return ruleSetList;

    }

    getRulesetRedemptionLimitAndBudget = async(transactionDate,numberOfTransactions)=>{
        const filter = {
            startDate: {
                $lte: transactionDate
            },
            endDate: {
                $gte: transactionDate
            },
            $or: [{
                redemptionLimit: { $gte: 0}
                },{
                $and: [{budget: {$gte: 0}},{minTransactions: {$lte: numberOfTransactions}}]
            }]
        };
        // step 1: To filter the ruleset based on transaction date.
        const ruleSetList = await this.list(filter);

        if(!ruleSetList){
            return [];
        }
        return ruleSetList;
    }


}

module.exports =  RuleSetOperation;