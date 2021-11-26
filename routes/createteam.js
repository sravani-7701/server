const express=require('express');
const router=express.Router();
const mongoose = require('mongoose')
require('../db/conn');
const User = require("../model/Userschema.js");
const Team= require("../model/Teamschema.js");
var ObjectId = require('mongodb').ObjectId;
router.post('/createteam',async(req,res)=>{
    try{
        const{name,AdminEmail}=req.body;
        if(!name||!AdminEmail){
           return res.status(401).json({message:"bad request"});
        }
        let admin= await User.findOne({email:AdminEmail});
        if(!admin){
            return res.status(400).json({message:"Invalid credentials"});
        }
        let array=[];
        const team=new Team({name,AdminEmail,array,array,array});
        await team.save();
        const result = await User.findOneAndUpdate({email:AdminEmail},{$push:{teams:team._id}},{new: true, useFindAndModify: false});
        return res.status(200).json({mesaage:"success"});
    }
    catch(err){
         console.log(err);
    }
})
router.post('/addstudent',async(req,res)=>{
    try{
      const{email,id}=req.body;
      if(!email||!id){
          return res.status(404).json({message:"Invalid details"});
      }
      let student= await User.findOne({email:email});
      const objectId = new ObjectId(id);
      let t=await Team.findOne({_id:objectId});
      if(!student){
          return res.status(403).json({message:"Student not found"});
      }
      else if(!t){
          return res.status(402).json({message:" Team details are invalid"});
      }
      const result = await Team.findOneAndUpdate({_id:objectId},{$push:{StudentEmail:email}},{new: true, useFindAndModify: false});
      const r=await User.findOneAndUpdate({email:email},{$push:{teams:objectId}},{new: true, useFindAndModify: false});
      return res.status(200).json({message:"success"});
    }
    catch(err){
       console.log(err);
    }
})
   
module.exports =router;