import express from 'express'

const router=express.Router();


router.get("/conversation",(req,res)=>{
    res.send("convo");
})


export default router;