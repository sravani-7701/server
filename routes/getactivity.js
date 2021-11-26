const express=require('express');
const router=express.Router();
const mongoose = require('mongoose')
const User= require("../model/Userschema.js");
router.get('/getactivity/:userid',async(req, res)=>{
    try{
    const userid = req.params.userid
    if(!userid){
        return res.status(400).send({message:"Invalid details"});
    }
    else{
      const id=mongoose.Types.ObjectId(userid)
      const user = await User.find({_id:id});
      console.log(user.name)
      return res.status(200).json(user.Activity);
    }
} 
   catch(error){res.status(404).json({message:error})}
})
module.exports=router;