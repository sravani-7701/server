const express=require('express');
const router=express.Router();
require('../db/conn');
const authenticate = require("../middleware/authenticate.js");
router.get('/about',authenticate,(req,res) => {
    res.send(req.rootUser);
})
module.exports =router;