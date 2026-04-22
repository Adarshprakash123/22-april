const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    title:String,
    Content:String,
    author:String,
},{timestamps:true})

module.exports=mongoose.model("Post",userSchema)