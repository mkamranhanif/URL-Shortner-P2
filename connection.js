const mongoose = require("mongoose")

async function connectMongosDB(url) {
    return mongoose.connect(url)
}

module.exports = {
    connectMongosDB,
}