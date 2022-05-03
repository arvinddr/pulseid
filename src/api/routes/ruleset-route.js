const {Router} = require('express');
const {addRuleset} =  require('../controller/ruleset.js');


const rulesetRoute = Router();

rulesetRoute.post('/',addRuleset);

module.exports = rulesetRoute;