const {createExpressApp} = require('../../api/middlewares/index');
const request = require("supertest");
const chai = require('chai')
const sinon = require('sinon');
var expect = chai.expect;
const {dbConnect,dbDisconnect,clearDatabase} = require("../../util/test-helper");
const {RuleSet} = require("../../dao/models/ruleset");
const {Transaction} = require("../../dao/models/transaction");
const {CashBack} = require("../../dao/models/cashback");


const app = createExpressApp();


const transactionData = {
    "date":"2022-01-25",
    "id":10,
    "customerId": 126
}

const transactionUrl = '/api/transactions';


describe(`Test Add transaction API: ${transactionUrl}- Success`, () => {
  
    before(async() => {
        await dbConnect();
    }); 
    
    afterEach(async() => {
        await clearDatabase();
    })

    after(async() => {
        await dbDisconnect();
    });
 
  
  it('Should able to successfuly add a transaction without countryId', async () => {
        const result = await request(app).post(transactionUrl)
            .send({
            "date":"2022-01-25",
            "id":10
            });

        const addedTransaction = await Transaction.find({ "id":10}).select({'date':1,'id':1,'_id':0});

        expect(addedTransaction[0]).to.have.property("date");
        expect(addedTransaction[0]).to.have.property("id");
        expect(result.statusCode).to.equal(201);
        expect(result.body.data).to.equal(undefined);
  });
  
  it('Should able to successfuly add a transaction with countryId', async () => {
    const result = await request(app).post(transactionUrl)
      .send(transactionData);
      const addedTransaction = await Transaction.find({ "id":10}).select({'date':1,'id':1,'_id':0});
    
      expect(addedTransaction[0]).to.have.property("date");
      expect(addedTransaction[0]).to.have.property("id");
      expect(addedTransaction[0]).to.have.property("customerId");
      expect(result.statusCode).to.equal(201);
      expect(result.body.data).to.equal(undefined);
  });
  
});


describe(`Test Add transaction API: ${transactionUrl} - Failure`, () => {	
    before(async() => {
        await dbConnect();
    }); 
    
    afterEach(async() => {
        await clearDatabase();
    })

    after(async() => {
        await dbDisconnect();
    });
  
  
 it('Should able to return 400 error for missing date paramter', async () => {
    const result = await request(app).post(transactionUrl)
      .send({
        "id":10,
      });
    
    expect(result.statusCode).to.equal(400);
    expect(result.body.data).to.equal(null);
    expect(result.body.error).to.not.deep.equal([{"message":"\"date\" is not missing","path":["date"],
        "type":"object.unknown","context":{"child":"startDate","label":"date","value":"12","key":"date"}}]);
  });

  it('Should able to return 400 error for missing id paramter', async () => {
    const result = await request(app).post(transactionUrl)
      .send({
        "date":"2022-02-10",
      });
    
      expect(result.statusCode).to.equal(400);
      expect(result.body.data).to.equal(null);
      expect(result.body.error).to.not.deep.equal([{"message":"\"id\" is not missing","path":["date"],
          "type":"object.unknown","context":{"child":"startDate","label":"id","value":"12","key":"id"}}]);
  });

  it('Should able to return 400 error for providing invalid paramter', async () => {
    const result = await request(app).post(transactionUrl)
      .send({
        "date":"2022-02-10",
        "xyx":"adada"
      });
    
      expect(result.statusCode).to.equal(400);
      expect(result.body.data).to.equal(null);
      expect(result.body.error).to.not.deep.equal([{"message":"\"xyx\" is not allowed","path":["date"],
          "type":"object.unknown","context":{"child":"startDate","label":"xyx","value":"adada","key":"id"}}]);
  });
  
  it('Should be able to handle internal server error', async () => {
    let mocked = sinon.stub(Transaction, "findOneAndUpdate")
    mocked.throws(new Error("Database Exception")); 

    const result = await request(app).post(transactionUrl)
      .send(transactionData);
    mocked.restore();
    
    expect(result.statusCode).to.equal(500);
    expect(result.body.data).to.equal(null);
    expect(result.body.error).to.equal("Exception in adding transaction to db");
  });

})


describe(`Test cashback operations API ${transactionUrl}`, async()=>{

    before(async()=>{
        await dbConnect();
    })

    afterEach(async() => {
        await clearDatabase();
    });

    after(async() => {
        await dbDisconnect();
    });

    it("Check max cashback alloted for transction within ruleset date range (No redemption limit/ No budget reated ruleset)", async()=>{
        // add ruleset
        await RuleSet.insertMany([{
            "startDate":"2022-01-10",
            "endDate":"2022-02-10",
            "cashback": 10
        },{
            "startDate":"2022-01-10",
            "endDate":"2022-02-10",
            "cashback": 5
        }])

        // add transaction 
        const result = await request(app).post(transactionUrl)
            .send({
            "date":"2022-01-25",
            "id":10
            });

        // Retrieve the cashback and check it worked as expected.
       const cashback = await CashBack.find({transactionId:10});
       expect(cashback[0].amount).to.equal(10);
       expect(result.statusCode).to.equal(201);
       expect(result.body.data).to.equal(undefined);
       
    })


    it("Check max cashback alloted for transction which is not in provided ruleset date range (No redemption limit/ No budget reated ruleset)", async()=>{
            await RuleSet.insertMany([{
                "startDate":"2022-03-10",
                "endDate":"2022-03-10",
                "cashback": 10
            },{
                "startDate":"2022-02-10",
                "endDate":"2022-03-10",
                "cashback": 5
            }])

            // add transaction 
            const result = await request(app).post(transactionUrl)
                .send({
                "date":"2022-01-25",
                "id":10
            });

            // Retrieve the cashback and check it worked as expected.
        const cashback = await CashBack.find({transactionId:10});
        expect(cashback.length).to.equal(0);
        expect(result.statusCode).to.equal(201);
        expect(result.body.data).to.equal(undefined);
    })

    it("Check max cashback alloted for transction within ruleset date range with redemption limit 0", async()=>{
        await RuleSet.insertMany([{
            "startDate":"2022-02-10",
            "endDate":"2022-03-10",
            "cashback": 10
        },{
            "startDate":"2022-01-10",
            "endDate":"2022-02-10",
            "cashback": 5,
            "redemptionLimit":0
        }])

        // add transaction 
        const result = await request(app).post(transactionUrl)
            .send({
            "date":"2022-01-25",
            "id":10
            });

        // Retrieve the cashback and check it worked as expected.
        const cashback = await CashBack.find({transactionId:10});
        expect(cashback.length).to.equal(0);
        expect(result.statusCode).to.equal(201);
        expect(result.body.data).to.equal(undefined);
    })

    it("Check max cashback alloted for transction within ruleset date range with redemption limit 1", async()=>{
            await RuleSet.insertMany([{
                "startDate":"2022-02-10",
                "endDate":"2022-03-10",
                "cashback": 10
            },{
                "startDate":"2022-01-10",
                "endDate":"2022-02-10",
                "cashback": 5,
                "redemptionLimit":1
            }])

            // add transaction 
            const result = await request(app).post(transactionUrl)
                .send({
                "date":"2022-01-25",
                "id":10
                });

            // Retrieve the cashback and check it worked as expected.
            const cashback = await CashBack.find({transactionId:10});
            expect(cashback[0].amount).to.equal(5); // cashback
            expect(result.statusCode).to.equal(201);
            expect(result.body.data).to.equal(undefined);
        
    })

    it("Check max cashback alloted for transction within ruleset date range having budget 0 and number of transactions > min transctions", async()=>{
            await RuleSet.insertMany([{
                "startDate":"2022-02-10",
                "endDate":"2022-03-10",
                "cashback": 10
            },{
                "startDate":"2022-01-10",
                "endDate":"2022-02-10",
                "cashback": 5,
                "budget":0,
                "minTransactions": 1
            }])

            // add transaction 
            const result = await request(app).post(transactionUrl)
                .send({
                "date":"2022-01-25",
                "id":10,
                "customerId":1
                });
            
            // Retrieve the cashback and check it worked as expected.
            const cashback = await CashBack.find({transactionId:10});
            expect(cashback.length).to.equal(0);  // no cashback
            expect(result.statusCode).to.equal(201);
            expect(result.body.data).to.equal(undefined);

    })

    it("Check max cashback alloted for transction within ruleset date range having budget $ and number of transactions < min transctions", async()=>{
        await RuleSet.insertMany([{
            "startDate":"2022-02-10",
            "endDate":"2022-03-10",
            "cashback": 10
        },{
            "startDate":"2022-01-10",
            "endDate":"2022-02-10",
            "cashback": 5,
            "budget":100,
            "minTransactions": 2
        }])

        // add transaction 
        const result = await request(app).post(transactionUrl)
            .send({
            "date":"2022-01-25",
            "id":10,
            "customerId":1
            });
        
        // Retrieve the cashback and check it worked as expected.
        const cashback = await CashBack.find({transactionId:11});
        expect(cashback.length).to.equal(0);  // no cashback
        expect(result.statusCode).to.equal(201);
        expect(result.body.data).to.equal(undefined);
    })

    it("Check max cashback alloted for transction within ruleset date range having budget $ and number of transactions > min transction", async()=>{
        await RuleSet.insertMany([{
            "startDate":"2022-02-10",
            "endDate":"2022-03-10",
            "cashback": 10
        },{
            "startDate":"2022-01-10",
            "endDate":"2022-02-10",
            "cashback": 5,
            "budget":10,
            "minTransactions": 1
        }])

        // add transaction 
        const result = await request(app).post(transactionUrl)
            .send({
            "date":"2022-01-25",
            "id":10,
            "customerId":1
            });
        
        // Retrieve the cashback and check it worked as expected.
        const cashback = await CashBack.find({transactionId:10});
        expect(cashback[0].amount).to.equal(5); 
        expect(result.statusCode).to.equal(201);
        expect(result.body.data).to.equal(undefined); 
    })

});