let NEO4J = {
  USERNAME: 'neo4j',
  PASSWORD: 'password'
};

let MONGO = {
  HOST: process.env.MONGO_HOST || '192.168.1.10',
  PORT: process.env.MONGO_PORT || 27017,
  DB: process.env.MONGO_DB || 'smartpathshala'
};

MONGO.URL = 'mongodb://' + MONGO.HOST + ':' + MONGO.PORT + '/' + MONGO.DB;

// MONGO.URL = 'mongodb://smartpathshala:smartpathshala@' + MONGO.HOST + ':' + MONGO.PORT + '/' + MONGO.DB;


module.exports = {
  NEO4J: NEO4J,
  MONGO: MONGO
};
//smartpathshala
//codestrippers
// system ip of sir 192.168.1.10 