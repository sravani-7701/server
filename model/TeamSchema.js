const mongoose = require('mongoose')
const conn=require('../db/conn')
const TeamSchema=new mongoose.Schema({
name:{
    type: String,
    required: true,
},
AdminEmail:{
    type:String,
    required: true,
},
StudentEmail:[
    {
            type:String,
            default:[],
    }
],
Files:[{
    filename:{type:String},
    originalname:{type:String},
    filetype:{type:String}
}],
Assignments:[{
    filename:{type:String},
    originalname:{type:String},
    Studentanswers:[{
     id:{type:String},
     filename:{type:String},
     originalname:{type:String},
     submittedtime:{type:Date},
    }],
    Scheduleddate:{type:Date},
    Enddate:{type:Date},
}],  
})
const Team = conn.model('TEAM',TeamSchema);
module.exports =Team;    