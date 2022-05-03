const {createExpressApp} = require('../../api/middlewares/index');
const request = require("supertest");
const chai = require('chai')
const sinon = require('sinon');
var expect = chai.expect;
const {dbConnect,dbDisconnect,clearDatabase} = require("../../util/test-helper");
const {RuleSet} = require("../../dao/models/ruleset");

const app = createExpressApp();

const rulesetData = {
        "startDate":"2022-01-10",
        "endDate":"2022-02-10",
        "cashback": 10,
        "redemptionLimit":10,
        "budget":100,
        "minTransactions":2
 }

const rulesetUrl = '/api/rulesets';


describe(`Test Add ruleset API: ${rulesetUrl}- Success`, () => {
  
  before(async() => {
    await dbConnect();
  });
  
  afterEach(async() => {
    await clearDatabase();
  })

  after(async() => {
    await dbDisconnect();
  });
  
  it('Should able to successfuly add a ruleset without redemption limit', async () => {
    const result = await request(app).post(rulesetUrl)
      .send({
        "startDate":"2022-01-10",
        "endDate":"2022-02-10",
        "cashback": 10,
      });
    
    
    const addedResultset = await RuleSet.find({"startDate":"2022-01-10", "endDate":"2022-02-10", "cashback": 10}).select({'startDate':1,'endDate':1,'cashback':1,'_id':0});
   

    expect(addedResultset[0]).to.have.property("startDate");
    expect(addedResultset[0]).to.have.property("endDate");
    expect(addedResultset[0]).to.have.property("cashback");
    expect(result.statusCode).to.equal(201);
    expect(result.body.data).to.equal(undefined);
  });
  
  it('Should able to successfuly add a ruleset with redemption limit', async () => {
    const result = await request(app).post(rulesetUrl)
      .send(rulesetData);
    
    const addedResultset = await RuleSet.find({
        "startDate":"2022-01-10",
        "endDate":"2022-02-10",
        "cashback": 10,
        "redemptionLimit":10
 }).select({'startDate':1,'endDate':1,'cashback':1,'redemptionLimit':1,'_id':0});  

    expect(addedResultset[0]).to.have.property("startDate");
    expect(addedResultset[0]).to.have.property("endDate");
    expect(addedResultset[0]).to.have.property("cashback");
    expect(addedResultset[0]).to.have.property("redemptionLimit");
    expect(result.statusCode).to.equal(201);
    expect(result.body.data).to.equal(undefined);
  });

  it('Should able to successfuly add a ruleset with redemption limit and budget', async () => {
    const result = await request(app).post(rulesetUrl)
      .send(rulesetData);
    
      const addedResultset = await RuleSet.find({
        "startDate":"2022-01-10",
        "endDate":"2022-02-10",
        "cashback": 10,
        "redemptionLimit":10,
        "budget":100,
        "minTransactions":2
 }).select({'startDate':1,'endDate':1,'cashback':1,'redemptionLimit':1,"budget":1,"minTransactions":1,'_id':0});  

    expect(addedResultset[0]).to.have.property("startDate");
    expect(addedResultset[0]).to.have.property("endDate");
    expect(addedResultset[0]).to.have.property("cashback");
    expect(addedResultset[0]).to.have.property("redemptionLimit");
    expect(result.statusCode).to.equal(201);
    expect(result.body.data).to.equal(undefined);

  });
  
});


describe(`Test Add ruleset API: ${rulesetUrl} - Failure`, () => {	
  
    before(async() => {
        await dbConnect();
      });
       
    after(async() => {
        await clearDatabase();
        await dbDisconnect();
    });
  
  it('Should able to return 400 error for missing cashback paramter', async () => {
    const result = await request(app).post(rulesetUrl)
      .send( {"startDate":"2022-01-10",
      "endDate":"2022-02-10"});
    
    expect(result.statusCode).to.equal(400);
        expect(result.body.data).to.equal(null)
    expect(result.body.error).to.not.deep.equal([{"message":"\"limt\" is not allowed","path":["limt"],
     "type":"object.unknown","context":{"child":"limt","label":"limt","value":"12","key":"limt"}}]);
    });

  it('Should able to return 400 error for missing date paramter', async () => {
    const result = await request(app).post(rulesetUrl)
      .send({
        "startDate":"2022-02-10",
        "cashback": 20
      });
    
    expect(result.statusCode).to.equal(400);
       expect(result.body.data).to.equal(null)
    expect(result.body.error).to.not.deep.equal([{"message":"\"startDate\" is not allowed","path":["startDate"],
    "type":"object.unknown","context":{"child":"startDate","label":"startDate","value":"12","key":"startDate"}}]);
  });

  it('Should able to return 400 error for providing invalid paramter', async () => {
    const result = await request(app).post(rulesetUrl)
      .send({
        "date":"2022-02-10"
      });
    
    expect(result.statusCode).to.equal(400);
expect(result.body.data).to.equal(null)
    expect(result.body.error).to.not.deep.equal([{"message":"\"endDate\" is not allowed","path":["endDate"],
     "type":"object.unknown","context":{"child":"endDate","label":"endDate","value":"12","key":"endDate"}}]);
    });
  
  
  it('Should be able to handle internal server error', async () => {
    let mocked = sinon.stub(RuleSet, "create")
    mocked.throws(new Error("Database Exception")); 

    const result = await request(app).post(rulesetUrl).send(rulesetData);
    mocked.restore();
    expect(result.statusCode).to.equal(500);
    expect(result.body.data).to.equal(null);
  });

})
