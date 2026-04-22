const router=require("express").Router();
const User=require("../models/User")

const auth=require("../middleware/auth")
const admin=require("../middleware/admin")

router.get("/",auth,admin,async(req,res)=>{
    res.json(await User.find());
})

router.delete("/:id",auth,admin,async(req,res)=>{
    await User.findByIdAndDelete(req.params.id,req.body,{new:true})
})

router.put("/:id",auth,admin,async(req,res)=>{
    res.json(
        await User.findByIdAndUpdate(req.params.id,req.body,{new:true})
    )
})

module.exports=router;