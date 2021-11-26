const Todo = require('../model/TodoSchema');
const express=require('express');
const mongoose = require('mongoose')
const router=express.Router();
router.get('/todo/:userid',async(req, res)=>{
    try{
    const userid = req.params.userid
    if(!userid){
        return res.status(400).send({message:"Invalid details"});
    }
    else{
      const todo = await Todo.find({userid:userid});
      return res.status(200).json(todo);
    }
} 
   catch(error){res.status(404).json({message:error})}
})
router.post('/todo/:userid',(req,res)=>{
    
        const userid = req.params.userid
        console.log(userid)
        const {text}=req.body
        if(!userid||!text){
            console.log("hii");
            return res.status(400).send({message:"Invalid details"});
        }
           else{
            const task = new Todo({userid:userid,text:text});
            task.save((err,doc) => {
                if(err) console.log(err)
                res.json(doc)
            })
        }
})
router.get('/todo/complete/:id', async (req, res) => {
	const todo = await Todo.findById(req.params.id);

	todo.complete = !todo.complete;

	todo.save();

	res.json(todo);
})

router.put('/todo/:id',async(req,res) => {
    try{
        const {text,id}=req.body
        if(!id||!text){
            return res.status(403).send({message:"Invalid details"});
        }
        else{
            const resu= await Todo.findByIdAndUpdate({id},{text});
            return res.status(200).send(resu);
        }
    }
    catch(err) {
        console.log(err);
    }
})
router.delete('/todo/:id',async(req,res) => {
    try{
        id=req.params.id
    if(!id){
        return res.status(404).send({message:"Invalid id"});
    }
    else{
        const result =await Todo.findByIdAndDelete(id);
        return res.status(200).json({result});
   }
}
   catch(err){
       console.log(err);
   }
})
module.exports = router