const express=require('express');
const { mongo, default: mongoose } = require('mongoose');
const cors=require("cors")

const auth=require("./routes/auth")
const posts=require("./routes/posts")
const users=require("./routes/users")
const app=express();
require('dotenv').config();
app.use(express.json());
// app.use(cors());


app.use(cors({
    origin:"http://localhost:3004",
    Credentials:true
}))

 


app.use("/api/auth",auth)
app.use("/api/posts",posts)
app.use("/api/users",users)

const PORT=process.env.PORT || 3000;

mongoose.connect(process.env.url)
.then(()=>console.log("connected"))
.catch(err=>console.log(err))



app.listen(PORT,()=>{
    console.log(`sever is listening on PORT ${3000}`)
})