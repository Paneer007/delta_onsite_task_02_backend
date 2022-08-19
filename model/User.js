const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    username:String,
    password:String,
    Accounts:[{
        
        ref:"Platform",
        type:mongoose.Schema.Types.ObjectId
    }],
    authenticated:{
        type: String,
        enum:['Yes','No'],
        default:"No"
    }
})
module.exports = mongoose.model('User',userSchema)