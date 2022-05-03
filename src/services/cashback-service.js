//Business logic to handle ruleset related functionalities
const cashBackOperation = require("../dao/operations/cashback-operation.js");
const ruleSetOperation  = require("../dao/operations/ruleset-operation.js");
const response = require('../util/response');
const transactionOperation = require("../dao/operations/transaction-operation");


class CashbackService {  

    //function to add the cashback to database.
    add = async(inputData)=>{
        try{
            const result = (new cashBackOperation()).add(inputData);
            return new response().created(result);

        }catch(exception){
            console.log("Error while trying to add cashback to database",{exception});
            throw new response().internalServerError(exception);
        }
    }

    list = async(inputData)=>{
        try{
            // default values.
            const limit = inputData['limit']?inputData['limit']:10;
            const offset = inputData['offset']?inputData['offset']:0;

            const result =  await (new cashBackOperation()).list(offset,limit);
            
            return new response().ok(result);

        }catch(exception){
            console.log("Error while trying to listing cashback",{exception});
            throw new response().internalServerError(exception);
        }
    }

    // function to calculate the cashbacks for given transaction.
    calculateCashback = async(transactionData)=>{
        
        try{
            let appliedRuleSet = null, numberOfTransactions=0;
            const transactionDate = transactionData['date'];
            

            // step 1: if customerId is present get the number of transactions for it.
            if(transactionData['customerId']){
                let transactionResult = await (new transactionOperation()).getNumberOfTransactions(transactionData['customerId']);
                console.log("number of transactions resukt " + JSON.stringify(transactionResult));
                numberOfTransactions = transactionResult && transactionResult[0]['numberOfTransactions']? transactionResult[0]['numberOfTransactions']:0;
                console.log("Number of transactions calculated for customer " + numberOfTransactions);
            }

            // step 2: Get the cashbacks from missing redemption limit.
            const cashBackRuleset = await (new ruleSetOperation()).getRulesetWithoutRedemptionLimit(transactionDate);
            console.log("cash back without redemption limit "+ JSON.stringify(cashBackRuleset));

            // step 3: get the cashbacks from redemption limit or budget.
            const cashBackRulesetForRedemptionOrBudget = await (new ruleSetOperation()).getRulesetRedemptionLimitAndBudget(transactionDate,numberOfTransactions);
            console.log("cash back with redemption limit "+ JSON.stringify(cashBackRulesetForRedemptionOrBudget));

             // step 4: decide the max ruleset out of obtined 2 ruleset.
            appliedRuleSet = this.maxCashbackRuleset(cashBackRuleset.concat(cashBackRulesetForRedemptionOrBudget),numberOfTransactions);

            console.log("applied rule set "+ JSON.stringify(appliedRuleSet));
            
            if(appliedRuleSet){
                // step 5: Update the appliedRuleSet with proper values and cashback.
                await (new ruleSetOperation()).update(appliedRuleSet);
                
                await (new cashBackOperation()).upsert({
                    transactionId: transactionData['id'],
                    amount: appliedRuleSet['cashback']
                });

                console.log("Updated the necessary cashback records and ruleset");
            }
            
        }catch(exception){
            console.log("Error while trying to calculate the cashbacks",{exception});
            throw new response().internalServerError(exception);
        
        }
    }


    // function to calculate the maxCashback
    maxCashbackRuleset = (filterRuleset,numberOfTransactions)=>{
        let maxCashback=0,appliedRuleSet=null;
        console.log("Filtered ruleset" + JSON.stringify(filterRuleset));
        
        for(let ruleset of filterRuleset){    
            
            if(ruleset['cashback'] > maxCashback){
                
                if(typeof ruleset['redemptionLimit'] === 'undefined' && typeof ruleset['budget'] === 'undefined' ){ // compute cash back for no redemption item
                    maxCashback = ruleset['cashback']; 
                    appliedRuleSet = ruleset;
                
                }else if(ruleset['redemptionLimit'] || (ruleset['budget'] && numberOfTransactions >= ruleset['minTransactions'])){ // for only redemption option or budget option
                    maxCashback = ruleset['cashback'];
                   
                    if(ruleset['redemptionLimit']){
                       
                        ruleset['redemptionLimit'] = ruleset['redemptionLimit'] - 1;
                        console.log("Updated Redemption limit "+ ruleset['redemptionLimit'])
                    }
                    // apply changes if budget is present.
                    if(ruleset['budget'] &&  numberOfTransactions >= ruleset['minTransactions']){
                        ruleset['budget'] = ruleset['budget'] - maxCashback;
                        console.log("Updated budget "+ ruleset['budget'])
                    }

                    appliedRuleSet = ruleset;
                   
                }
                
            }
        }
        return appliedRuleSet; // Max back ruleset. 
    }

    
}


module.exports =  CashbackService;