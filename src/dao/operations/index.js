const mongoose = require("mongoose");
   
 const mongdb = (()=>{
    var connection = null;
    const dbUrl = process.env.DATBASE_URL?`${process.env.DATBASE_URL}${process.env.DATABASE}`:'';
    console.log(dbUrl);

    return {
        'connect': (async ()=>{
            try{
                
                if(!connection){
                    
                    connection = await mongoose.connect(dbUrl,{useNewUrlParser: true});
                    console.log(`Database connection is successful`);
                    return connection;
                }
                
                return connection;
            
            
            }catch(exception){
                console.log(`Exception while setting connection to database`, {exception});
                throw new Error('Exception in Database connection');
            }
        })
    }
});


 const disconnectDb = async(conn)=>{
    conn.disconnect();
}

module.exports = {
    disconnectDb,mongdb
}