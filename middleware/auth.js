const jwt=require('jsonwebtoken');
const secret=process.env.JWT_SECRET || "secret";

module.exports=function(req,res,next){
    const authHeader=req.header("Authorization");
    const token=authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

    if(!token) return res.status(401).json({message:"No token"})

    try{
        const verified=jwt.verify(token,secret);
        req.user=verified;
        next();
    }catch(err){
        res.status(401).json({message:"Invalid token"})
    }
}
