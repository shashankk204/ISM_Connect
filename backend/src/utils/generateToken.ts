import jwt from "jsonwebtoken";
import { Response } from "express";


export default function generatoken(UserId:string,res:Response)
{   
    let token=jwt.sign({UserId},process.env.JWT_SECRET!,{expiresIn:"15d"});
    res.cookie("token",token,{
        maxAge:15*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV!=="development"
    })
    return token;
}