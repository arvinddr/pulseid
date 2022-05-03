const {createExpressApp} = require('../../api/middlewares/index');
const request = require("supertest");
const chai = require('chai')
const sinon = require("sinon");
var expect = chai.expect;
const {dbConnect,dbDisconnect,clearDatabase} = require("../../util/test-helper");
const {CashBack} = require("../../dao/models/cashback");

const app = createExpressApp();

const cashbackResponse = {
    "httpCode": 200,
    "data": [
        {
            "transactionId": 1,
            "amount": 10
        },
        {
            "transactionId": 2,
            "amount": 10
        },
        {
            "transactionId": 4,
            "amount": 20
        },
        {
            "transactionId": 6,
            "amount": 20
        },
        {
            "transactionId": 8,
            "amount": 20
        },
        {
            "transactionId": 10,
            "amount": 5
        }
    ],
    "error": null
}


const cashDbData = [
    {
        "transactionId": 1,
        "amount": 10
    },
    {
        "transactionId": 10,
        "amount": 5
    },
    {
        "transactionId": 2,
        "amount": 10
    },
    {
        "transactionId": 4,
        "amount": 20
    },
    {
        "transactionId": 6,
        "amount": 20
    },
    {
        "transactionId": 8,
        "amount": 20
    }
]

const cashbackUrl = '/api/cashbacks';


describe(`Test get cashbacks API: ${cashbackUrl}- Success`, () => {
  
    before(async() => {
        await dbConnect();
        await CashBack.insertMany(cashDbData);
    });
  
  
    after(async() => {
        await clearDatabase();
        await dbDisconnect();
    });
  
  it('Should able to successfuly get cashback', async () => {
    const result = await request(app).get(cashbackUrl);
    
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.deep.equal(cashbackResponse);
  });
  
  it('Should able to successfuly get cashback with limit and offset', async () => {
    const result = await request(app).get(cashbackUrl).query({limit:6,offset:0})
      
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.deep.equal(cashbackResponse);
  });
 
});


describe(`Test get cashbacks API: ${cashbackUrl} - Failure`, () => {	
  
    before(async() => {
        await dbConnect();
        await CashBack.insertMany(cashDbData);
    });
  
    after(async() => {
        await clearDatabase();
        await dbDisconnect();
    });
  
  it('Should able to return 400 error for providing invalid paramter', async () => {
    const result = await request(app).get(cashbackUrl).query({limt:12,offset:0})
    
    expect(result.statusCode).to.equal(400);
    expect(result.body.data).to.equal(null);
    expect(result.body.error).to.not.deep.equal([{"message":"\"limt\" is not allowed","path":["limt"],
    "type":"object.unknown","context":{"child":"limt","label":"limt","value":"12","key":"limt"}}]);
  })
  
  it('Should be able to handle internal server error', async () => {

    let mocked = sinon.stub(CashBack, "find").throws(new Error("Database Exception")); 

    const result = await request(app).get(cashbackUrl);
    mocked.restore();

    expect(result.statusCode).to.equal(500);
    expect(result.body.data).to.equal(null);
  
  });

})
