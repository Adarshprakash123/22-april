const express=require('express');
const mongoose = require('mongoose');
const cors=require("cors")

const auth=require("./routes/auth")
const posts=require("./routes/posts")
const users=require("./routes/users")
const app=express();
require('dotenv').config();
app.use(express.json());

const normalizeOrigin=(origin)=>origin?.replace(/\/$/, "");
const envOrigins=(process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin)=>normalizeOrigin(origin.trim()))
    .filter(Boolean);

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://22-april-frontend.vercel.app",
    ...envOrigins
].map(normalizeOrigin).filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        const normalizedOrigin=normalizeOrigin(origin);
        const isLocalDev=/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(normalizedOrigin || "");
        if (!origin || isLocalDev || allowedOrigins.includes(normalizedOrigin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials:true
}))

app.get("/", (req, res) => {
    res.json({ message: "Blog API is running" });
})


app.use("/api/auth",auth)
app.use("/api/posts",posts)
app.use("/api/users",users)

const PORT=process.env.PORT || 3000;
const mongoUrl=process.env.MONGO_URL || process.env.url;

mongoose.connect(mongoUrl)
.then(()=>console.log("connected"))
.catch(err=>console.log(err))



app.listen(PORT,()=>{
    console.log(`server is listening on PORT ${PORT}`)
})
