const {createExpressApp} = require('./api/middlewares/index.js');
const {mongdb} = require('./dao/operations/index.js');

var app = createExpressApp();

const port = process.env.PORT || 4001;

app.listen(port,async()=>{
    console.log(`Server is listening on ${port}` + process.env.DATABASE);
    const mongdbInstance = mongdb(); //creat database connection.
    await mongdbInstance.connect();
});






