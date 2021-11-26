const jwt=require('jsonwebtoken');
const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
require('../db/conn');
const User = require("../model/Userschema.js");
router.post('/login',async(req, res)=>{
    try{
    const{email,password,usertype}=req.body;
     if(!email||!password||!usertype){
         return res.status(400).json({message:"bad request"});
     }
     let userlogin= await User.findOne({email:email});
     if(!userlogin){
        return res.status(400).json({message:"User does not exist"});
     }
     else{
        const isMatch=await bcrypt.compare(password,userlogin.password);
        const token= await userlogin.generateAuthToken();
        res.cookie("jwtoken",token,{
            expires:new Date(Date.now()+25892000000),
             httpOnly:true
        })
        if(isMatch){
            return res.status(200).json({message:"login success"});
        }
        else{
            return res.status(400).json({message:"Invalid credentials"});
        }
    }
    }
    catch(err){
    console.log(err);
    }
})
router.get('/login',(req, res)=>{
    res.send("hello");
})


module.exports=router;