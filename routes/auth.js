const router=require("express").Router();
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User =require("../models/User")

// register

const secret=process.env.JWT_SECRET || "secret";

function sanitizeUser(user){
    const safe=user.toObject ? user.toObject() : user;
    delete safe.password;
    return safe;
}

router.post("/register",async(req,res)=>{
    try{
        const { username, email, password } = req.body;
        if(!username || !email || !password){
            return res.status(400).json({message:"Username, email and password are required"});
        }

        const existing=await User.findOne({email});
        if(existing) return res.status(409).json({message:"Email already registered"});

        const hashed=await bcrypt.hash(password,10);

        const user=new User({
            username,
            email,
            password:hashed,
            isAdmin:process.env.ADMIN_EMAIL?.toLowerCase() === email.toLowerCase()
        })
        await user.save();
        res.status(201).json(sanitizeUser(user));
    }catch(err){
        res.status(500).json({message:"Registration failed"});
    }
})

// login

router.post("/login",async(req,res)=>{
    try{
        const { email, password } = req.body;
        const user=await User.findOne({ email })
        if(!user) return res.status(404).json({message:"User not found"});

        const valid=await bcrypt.compare(password,user.password);
        if(!valid) return res.status(400).json({message:"Wrong password"});

        const token=jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin
        },secret,{expiresIn:"7d"})

        res.json({user:sanitizeUser(user),token})
    }catch(err){
        res.status(500).json({message:"Login failed"});
    }
})

module.exports=router;
