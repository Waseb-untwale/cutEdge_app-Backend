const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
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
    image:{}
},{
  timestamps:true
})


module.exports = mongoose.model("Blog",blogSchema)



  