const {Router} = require('express');
const {addTransaction} = require('../controller/transaction.js');


const transactionRoute = Router();

transactionRoute.post('/',addTransaction);

module.exports = transactionRoute;