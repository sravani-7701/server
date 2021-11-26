const mongoose = require('mongoose')
const conn=require('../db/conn')
const TodoSchema=new mongoose.Schema({
    userid:{
        type:String,
        required:true
    },
    text: {
		type: String,
		required: true
	},
	complete: {
		type: Boolean,
		default: false
	},
	timestamp: {
		type: String,
		default: Date.now()
	}
})
const Todo = conn.model('TODO',TodoSchema);
module.exports =Todo;