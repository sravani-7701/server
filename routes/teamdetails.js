const express=require('express');
const router=express.Router();
const mongoose = require('mongoose')
require('../db/conn');
const Team= require("../model/Teamschema.js");
router.get('/teamdetails/:team',async(req,res)=>{
    try{
        const teamId = req.params.team;
        console.log(teamId);
        var objectId = mongoose.Types.ObjectId(teamId);
        const data= await Team.findOne({_id:objectId});
        if(!data){
            console.log("Couldn't find'");
           return res.status(402).send("invalid")
        }
        res.status(200).json(data);
    }
    catch(err){
       console.log(err);
    }
})
module.exports =router;