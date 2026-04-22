const router=require("express").Router();
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User =require("../models/User")

// register

const secret="jklledknedkj"

router.post("/register",async(req,res)=>{
    const password=req.body;
    const hashed=await bcrypt.hash(req.body.password,10);

    const user=new User({
        username:req.body.username,
        email:req.body.email,
        password:hashed
    })
    await user.save();
    res.json(user);
})

// login

router.post("/login",async(req,res)=>{
    const user=await User.findOne({
        email:req.body.email
    })
    if(!user) return res.status(404).json("user Not Found");

    const valid=await bcrypt.compare(req.body.password,user.password);
    if(!valid) return res.status(400).json("Wrong Password");

    const token=jwt.sign({
        i:user._id,
    },"secret")

    res.json({user,token})
})

module.exports=router;