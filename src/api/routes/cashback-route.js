const {Router} = require('express');
const {getCashbacks} =require('../controller/cashback.js');


const cashBackRoute = Router();

cashBackRoute.get('/',getCashbacks);

module.exports =  cashBackRoute;