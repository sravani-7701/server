const jwt=require('jsonwebtoken');
const express=require('express');
const router=express.Router();
require('../db/conn');
const User = require("../model/Userschema.js");
router.post('/signup',async(req,res)=>{  
    try{
     const{name,email,phone,password,cpassword,usertype}=req.body
     if(!name||!email||!password||!cpassword||!phone||!usertype){
        return  res.status(400).json({message:"Fill the credentials properly"})
     }
     const userexist =await User.findOne({email: email});
     if(userexist){
         return res.status(401).json({message:"User already exist"});
     } 
     else{
         let array=[];
         let user= new User({name,email,phone,password,cpassword,usertype,Activity:array});
        await user.save();
         res.status(201).json({message:"success"})
        }
    }
    catch(error){
        console.log(error);
    }
});
module.exports =router;