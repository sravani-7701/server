const express=require('express');
const path=require('path');
const crypto = require('crypto');
//const mongoose = require('mongoose');
const multer=require('multer');
const Grid=require("gridfs-stream");
const mongoose = require('mongoose')
const {GridFsStorage}=require("multer-gridfs-storage");
const methodOverrride=require('method-override');
const conn=require('../db/conn');
const Pusher=require('pusher');
const router=express.Router();
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Team= require("../model/Teamschema.js");
const pusher = new Pusher({
  appId: "1298742",
  key: "efe402f7959d9ab3433e",
  secret: "308f96ac809d960978fc",
  cluster: "ap2",
  useTLS: true
});

let gfs;
conn.once('open',()=>{
    gfs=Grid(conn.db,mongoose.mongo);
    console.log("gfs initialized");
    gfs.collection('uploads')

})
var storage = new GridFsStorage({
    url:"mongodb+srv://sravani:rosra0704@cluster0.alfxl.mongodb.net/classroom?retryWrites=true&w=majority",
    file: (req, file) => {
        console.log(file);
        console.log("file");
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

  router.post("/upload/:id",upload.single('file'), async(req, res) => {
    try{
    const id=req.params.id;
    console.log(req.file);
    if(!req.file){
      return res.status(404).json({message:"File not found"});
    }
    const _id=mongoose.Types.ObjectId(id);
    const team= await Team.findOne({_id:_id});
    team.Files.push({filename:req.file.filename,originalname:req.file.originalname})
    await team.save();
    var length=team.StudentEmail.length();
    for(var i=0;i<length;i++){
        const user=User.findOne({email:team.StudentEmail[i]});
        user.Activity.push({ActivityType:"fileadded",teamName:team.name})
        user.save();
        var id=user._id.toString
        pusher.trigger(`${id}`,"fileadded",{
            ActivityType:"fileadded",
            teamName:team.name
        })
    }      
     res.status(200).json({message:"success"});
    }
    catch(err){
      return res.status(404).json({message:`${err}`})
    }
  });
  router.post("/createassignment/:id/:startdate/:enddate",upload.single('file'), async(req, res)=>{
    const id=req.params.id;
    const startDate=req.params.startdate
    const endDate=req.params.enddate
    if(!req.file||!id||!startDate||!endDate){
      return res.status(404).json({message:"Invalid details"})
    }
    else {
      const _id=mongoose.Types.ObjectId(id);
      const team=await Team.findOne({_id:_id});
      if(!team) return res.status(403).json({message:"Team not found"});
      else{
        team.Assignments.push({filename: req.file.filename, originalname: req.file.originalname,Studentanswers:[],
          Scheduledate:req.startDate,Enddate:req.endDate});
       await team.save();
       return res.status(200).json({message:"Assignment Succesfully created "});
      }  
    }   
  })
  router.post("/submitassignment/:id/:filename/:userid",upload.single('file'), async(req, res)=>{
    const id=req.params.id;
    const filename=req.params.filename
    const userid=req.params.userid
    if(!req.file||!id||!filename||!userid){
      return res.status(404).json({message:"Invalid details"})
    }
    else {
      const _id=mongoose.Types.ObjectId(id);
      const team=await Team.findOne({_id:_id});
      if(!team) return res.status(403).json({message:"Team not found"});
      else{
        const required=team.Assignments.filter(function(assigment){
          return assigment.filename===filename;
        })  
        required[0].Studentanswers.push({id: userid,filename:req.file.filename, originalname: req.file.originalname,submittedtime:Date.now()});
       await team.save();
       return res.status(200).json({message:"Assignment Submitted succesfully"});
      }  
    }   
  })
  router.get("/file/:filename",async(req,res) => {
   const filenames=req.params.filename;
   console.log(req.params.filename);
   const options = {}
       gfs.files.findOne({filename: filenames},(err, file)=>{
         if(err){
           console.log(err);
         }
         else {
           if(!file ||!file.length===0){
             return res.status(404).json({message:"file does'nt exists"});
           }
           let mimeType = file.contentType;
           console.log(mimeType);
          if (!mimeType) {
              mimeType = mime.lookup(file.filename);
          }
          res.set({
              'Content-Type': mimeType,
              'Content-Disposition': 'attachment; filename=' + file.filename
          });

          const readStream = gfs.createReadStream(file.filename);
          readStream.on('error', err => {
              console.log(err);
          });
          console.log("get file");
          readStream.pipe(res);
      }
     })
  })
module.exports=router;