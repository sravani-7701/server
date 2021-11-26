const mongoose = require('mongoose');
const DB=process.env.DATABASE;
const conn = mongoose.createConnection(DB, {useNewUrlParser: true,useUnifiedTopology:true});

/*mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(() =>{
    console.log("connection successful db");
}).catch((err) =>{
console.log(err)
});*/
module.exports=conn;