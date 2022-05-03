const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Cashback API Documentation', // Title of the documentation
        version: '1.0.0', // Version of the app
        description: 'API documentations for Cashback related apis', // short description of the app
    },
    servers:[
        {
            url: 'http://localhost:4001/api',
            description: 'Local server'
        }       
    ]
};


const options = {
    // import swaggerDefinitions
    swaggerDefinition,
    // path to the API docs
    apis: ['./api/swagger-doc/**/*.yaml'],
  };

  // initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = {swaggerSpec};
