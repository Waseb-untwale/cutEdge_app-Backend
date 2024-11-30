const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        unique:true,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        required:true,
       
    },
    image:{
        type:String,
        required:true,
    },
},{
  timestamps:true
})


module.exports = mongoose.model("Blog",blogSchema)



  