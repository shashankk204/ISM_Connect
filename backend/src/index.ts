import express from "express"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
const app=express();


app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes)

app.listen(3000,()=>(console.log("listing to port 3000")));