const  jwt=require('jsonwebtoken');
const User=require("../model/Userschema")
const authenticate= async (req, res, next)=>{
     try{
        const token=req.cookies.jwtoken;
        const verifyToken=jwt.verify(token,process.env.SECRET_KEY);
        let rootUser;
        rootUser=await User.findOne({_id:verifyToken._id,"tokens.token":token});
        if(!rootUser){
            console.log("Couldn't find'");
           return res.status(402).send("invalid")
        }
         req.token=token;
         req.rootUser=rootUser;
         req.userID=rootUser._id;
         next();
     }
     catch(err){
        console.log(err);
        res.status(401).send("unauthorized");
     }
}
module.exports=authenticate;