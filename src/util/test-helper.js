const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
var instance

const dbConnect = async () => {
    instance = await MongoMemoryServer.create();
    const uri = instance.getUri();
    console.log("uri" + uri);

  const mongooseOpts = {
    useNewUrlParser: true
  };

  await mongoose.connect(uri, mongooseOpts);
  return instance;
};

const dbDisconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await instance.stop();
};

const clearDatabase = async()=>{
    const collections = mongoose.connection.collections;
    for(const key in collections){
        const collection = collections[key];
        await collection.deleteMany();
    }
}

module.exports = {dbConnect,dbDisconnect,clearDatabase}