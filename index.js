const dotenv=require('dotenv');
const mongoose = require('mongoose');
const express=require('express');
const app=express();
const bodyParser = require('body-parser');
const path=require('path');
const crypto = require('crypto');
const multer=require('multer');
const Grid=require("gridfs-stream");
const methodOverrride=require('method-override');
var cors = require('cors')
var cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(cors())
app.use(express.json());
app.use(methodOverrride('_method'));
dotenv.config({path:"./config.env"});
require('./db/conn');
const PORT=process.env.PORT;
app.use(cors());
app.use(require("./routes/signup"));
app.use(require("./routes/login"));
app.use(require("./routes/createteam"));
app.use(require("./routes/about"));
app.use(require("./routes/teamdetails"));
app.use(require("./routes/fileupload"));
app.use(require("./routes/todo.js"))
app.use(require("./routes/getactivity.js"));
app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})