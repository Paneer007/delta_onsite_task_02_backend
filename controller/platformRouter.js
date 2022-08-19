const platformRouter = require("express").Router()
const Platform = require("../model/Platform")
const User = require("../model/User")
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = process.env.E_KEY;

const getToken = (request)=>{
    let authorization = request.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer')){
        return authorization.substring(7)
    }
    else{
        return false
    }
}
platformRouter.post('/',async(req,res)=>{
    // const token = getToken(req)
    const token=  req.cookies.jwt

    console.log(token)
    if(!token){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const decodedToken = jwt.verify(token,process.env.SECRET)
    if(!decodedToken){
        return res.status(400).send({message:"enter a valid token"})
    }
    const user = await User.findById(decodedToken.id)
    if(user.authenticated=="No"){
        return res.status(400).send({message:"Enter valid credentials"})
    }
    const body = req.body
    console.log(body)
    const cipher = crypto.createCipher(algorithm, key);

    const passEncrypt =  cipher.update(body.Password, 'utf8', 'hex') + cipher.final('hex');
    console.log(passEncrypt)
const decipher = crypto.createDecipher(algorithm, key);

    var decrypted = decipher.update(passEncrypt, 'hex', 'utf8') + decipher.final('utf8');
    console.log(decrypted)
    const platform = new Platform({service:body.Service,email:body.Email,username:body.Name,password:passEncrypt})
    platform.save()
    console.log(user)
    user.Accounts=[...user.Accounts,platform._id]
    user.save()
    return res.status(200).send({message:"all good"})
})
platformRouter.patch('/update',async(req,res)=>{
    const body = req.body
    // const token = getToken(req)
   const token=  req.cookies.jwt
    console.log(body)
    if(!token){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const decodedToken = jwt.verify(token,process.env.SECRET)
    if(!decodedToken){
        return res.status(400).send({message:"enter a valid token"})
    }
    const user = await User.findById(decodedToken.id)
    if(user.authenticated=="No"){
        return res.status(400).send({message:"Enter valid credentials"})
    }
    const passTrue = await bcrypt.compare(body.userpass,user.password)
    if(!passTrue){
        return res.status(400).send({error:"wrong password"})
    }
    const platform = await Platform.findById(body.id)
const cipher = crypto.createCipher(algorithm, key);

    const passEncrypt =  cipher.update(body.password, 'utf8', 'hex') + cipher.final('hex');
    platform.email = body.email
    platform.password= passEncrypt
    platform.username= body.username
    await platform.save()
    return res.status(200).send({message:"done"})

})
platformRouter.delete('/delete/:id',async(req,res)=>{
    const platid= req.params['id']
    let password = req.body.data
    const token=  req.cookies.jwt

    // const token = getToken(req)
    console.log(token,password,platid)
    if(!token){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const decodedToken = jwt.verify(token,process.env.SECRET)
    if(!decodedToken){
        return res.status(400).send({message:"enter a valid token"})
    }
    const user = await User.findById(decodedToken.id)
    if(user.authenticated=="No"){
        return res.status(400).send({message:"Enter valid credentials"})
    }
    const passTrue = await bcrypt.compare(password,user.password)
    if(!passTrue){
        return res.status(400).send({error:"wrong password"})
    }
    const platform = await Platform.findByIdAndDelete(platid)
    return res.status(200).send({error:"all good"})
s})
module.exports = platformRouter