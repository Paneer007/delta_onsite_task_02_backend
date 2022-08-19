const User = require("../model/User")
const loginRouter= require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dayjs = require("dayjs")
const getToken = (request)=>{
    let authorization = request.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer')){
        return authorization.substring(7)
    }
    else{
        return false
    }
}
loginRouter.post('/',async(req,res)=>{
    const body= req.body
    console.log(body)
    const user = await User.findOne({username:body.username})
    if(user==undefined){
        return res.status(400).send({error:"user is not made an account"})
    }
    const passValid = bcrypt.compare(body.password,user.password)
    if(!passValid){
        return res.status(400).send({message:"error user not found"})
    }
    const tokenBody = {id:user._id,username:body.username}
    const jwtToken = jwt.sign(tokenBody,process.env.SECRET)
    user.authenticated = "Yes"
    await user.save()
    res.cookie('jwt',jwtToken,{httpOnly:true})
    return res.status(200).send({jwtToken:jwtToken})
})
loginRouter.post("/unauthenticate",async(req,res)=>{
    const token=  req.cookies.jwt
    console.log('hi')
    // const token = getToken(req)
    if(!token){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const decodedToken = jwt.verify(token,process.env.SECRET)
    if(!decodedToken){
        return res.status(400).send({message:"enter a valid token"})
    }
    const user = await User.findById(token.id)
    user.authenticated = "No"
    return res.status(200)
})
module.exports = loginRouter