const mongoose = require("mongoose")
const platformSchema = new mongoose.Schema({
    service:String,
    email:String,
    password:String,
    username: String
})
module.exports = mongoose.model("Platform",platformSchema)
