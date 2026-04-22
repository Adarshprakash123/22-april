const router=require("express").Router();
const Post=require("../models/Post");

const auth=require("../middleware/auth")
const admin=require("../middleware/admin")
// create
router.post("/",async(req,res)=>{
    const post=new Post(req.body);
    res.json(await post.save());
})

router.put("/:id",auth,admin,async(req,res)=>{
    res.json(
        await Post.findByIdAndUpdate(req.params.id,req.body,{new:true})
    )
})

// read all
router.get("/",async(req,res)=>{
    res.json(await Post.find().sort({createdAt:-1}))
})

// read one
router.get("/:id",async(req,res)=>{
    res.json(await Post.findByIdAndUpdate(req.params.id,req.body,{new:true}))
})

// delete
router.delete("/:id",auth,admin,async(req,res)=>{
    await Post.findByIdAndDelete(req.params.id);
    res.json("deleted")
})

module.exports=router;