const {Router} = require('express');
const transactionRoutes = require('./transaction-route.js');
const cashbackRoutes = require('./cashback-route.js');
const rulesetRoutes = require('./ruleset-route.js');
const {swaggerSpec} = require('../../swagger');
const swaggerUi = require('swagger-ui-express');


const mainRoutes = Router();

mainRoutes.use('/cashbacks',cashbackRoutes);
mainRoutes.use('/transactions',transactionRoutes);
mainRoutes.use('/rulesets',rulesetRoutes);
mainRoutes.use('/swagger-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // API documentation.

module.exports = {mainRoutes}