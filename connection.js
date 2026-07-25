const mongoose = require("mongoose")

//connection the mongoDB with Nodejs
async function connectMongosDB(url) {
  return mongoose.connect(url)
}

module.exports = {
  connectMongosDB,
}
