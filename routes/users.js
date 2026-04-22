const router=require("express").Router();
const User=require("../models/User")
const bcrypt=require("bcryptjs");

const auth=require("../middleware/auth")
const admin=require("../middleware/admin")

router.get("/",auth,admin,async(req,res)=>{
    res.json(await User.find().select("-password").sort({createdAt:-1}));
})

router.delete("/:id",auth,admin,async(req,res)=>{
    await User.findByIdAndDelete(req.params.id,req.body,{new:true})
    res.json({message:"User deleted"})
})

router.put("/:id",auth,admin,async(req,res)=>{
    const update={...req.body};
    if(update.password){
        update.password=await bcrypt.hash(update.password,10);
    }
    res.json(
        await User.findByIdAndUpdate(req.params.id,update,{new:true,runValidators:true}).select("-password")
    )
})

module.exports=router;
