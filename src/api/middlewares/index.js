// Create express app and add middlewares.
const cors = require('cors');
const express = require('express');
const {mainRoutes} = require('../routes/index.js')

const corsMiddleware = (app)=>{
    app.use(cors());
    return app;
}


const parserMiddleware = (app)=>{
    app.use(express.json());
    app.use(express.urlencoded({extended: true}))
    return app;
}

const routingMiddleware = (app)=>{
    app.use('/api', mainRoutes);  
    return app;
}

const attachMiddlewares = ()=>{
    let app = express();
    app = corsMiddleware(app);
    app = parserMiddleware(app);
    app = routingMiddleware(app);
    return app;
}

const createExpressApp = () =>{
    return attachMiddlewares();
}

module.exports = {createExpressApp}