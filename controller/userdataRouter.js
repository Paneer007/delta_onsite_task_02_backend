const userdataRouter = require("express").Router()
const User= require('../model/User')
const Platform = require("../model/Platform")
const jwt = require("jsonwebtoken")
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = process.env.E_KEY;

const getToken = (request)=>{
    let authorization = request.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer')&& authorization.length>8){
        return authorization.substring(7)
    }
    else{
        return false
    }
}
userdataRouter.get("/",async(req,res)=>{

    //const token = getToken(req)
    const token=  req.cookies.jwt
    console.log(token)
    if(!token){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const decodedToken = jwt.verify(token,process.env.SECRET)
    if(!decodedToken){
        return res.status(400).send({message:"enter a valid token"})
    }
    const person = await User.findById(decodedToken.id).populate('Accounts')
    console.log(person)
    console.log(person.Accounts)
    let decryptedAccounts = person.Accounts.map((x)=> {
        const decipher = crypto.createDecipher(algorithm, key);
        return(
            {...x._doc, password:(decipher.update(x.password, 'hex', 'utf8') + decipher.final('utf8'))}
        )
    })
    console.log('ok pa')
    console.log(decryptedAccounts)
    let updatedUser = {...person._doc, Accounts:decryptedAccounts}
    console.log(updatedUser)
    if(person.authenticated=="No"){
        return res.status(400).send({message:"Error"})
    }
    return res.status(200).send(updatedUser)
})

module.exports = userdataRouter