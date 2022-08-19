const signupRouter = require("express").Router()
const User = require("../model/User")
const bcrypt = require("bcrypt")
signupRouter.post("/",async(req,res)=>{
    console.log('im here')
    const body = req.body
    console.log(body)
    const listOfUser = await User.findOne({username:body.username})
    console.log(listOfUser)
    if(listOfUser){
        return res.status(400).send({error:"username is already taken"})
    }
    const saltRound = 10
    const passHash = await bcrypt.hash(body.password,saltRound)
    const newUser = new User({
        username:body.username,
        password:passHash
    })
    await newUser.save()
    return res.status(200).send({message:"signed up"})
})
module.exports = signupRouter