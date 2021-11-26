const jwt= require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt=require('bcryptjs')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const conn=require('../db/conn')
const StudentSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type:String,
        required: true,
    },
    phone:{
        type:Number,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
    cpassword:{
        type:String,
        required: true,
    },
    tokens:[
        {
            token:{
                type:String,
                required: true,
            }
        }
    ],
    emailToken:{
        type:String,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    teams:[
        {
            type:ObjectId,
            default:[],
        }
    ]
   
})
StudentSchema.pre('save',async function(next) {
    console.log('hello');
 if(this.isModified('password')){
     this.password= await bcrypt.hash(this.password,12);
     this.cpassword= await bcrypt.hash(this.cpassword,12);
 }

 next();
});

StudentSchema.methods.generateAuthToken=async function(){
    try{
      
     let token=jwt.sign({_id:this._id},process.env.SECRET_KEY);
     this.tokens=this.tokens.concat({token:token});
     await this.save();
     return token;
    }
    catch(err){
    console.log(err);
    }
}

const Student = conn.model('STUDENT',StudentSchema);
module.exports =Student;