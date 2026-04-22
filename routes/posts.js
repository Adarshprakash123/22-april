const router=require("express").Router();
const Post=require("../models/Post");

const auth=require("../middleware/auth")
const admin=require("../middleware/admin")
// create
router.post("/",auth,admin,async(req,res)=>{
    const post=new Post({
        title:req.body.title,
        content:req.body.content || req.body.Content,
        author:req.body.author || "Admin"
    });
    res.status(201).json(await post.save());
})

router.put("/:id",auth,admin,async(req,res)=>{
    const update={
        ...req.body,
        content:req.body.content || req.body.Content
    }
    delete update.Content;
    res.json(
        await Post.findByIdAndUpdate(req.params.id,update,{new:true,runValidators:true})
    )
})

// read all
router.get("/",async(req,res)=>{
    res.json(await Post.find().sort({createdAt:-1}))
})

// read one
router.get("/:id",async(req,res)=>{
    const post=await Post.findById(req.params.id);
    if(!post) return res.status(404).json({message:"Post not found"});
    res.json(post)
})

// delete
router.delete("/:id",auth,admin,async(req,res)=>{
    await Post.findByIdAndDelete(req.params.id);
    res.json({message:"Post deleted"})
})

module.exports=router;
