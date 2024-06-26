import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

interface decodedtoken extends JwtPayload
{
    UserId:string
}

export default function ProtectedRoute(req:Request,res:Response,next:NextFunction)
{
    try {
        const token=req.cookies.token;
        
        if(!token)
        {
            return res.status(400).json({error:"unauthorized access"});
        }

        const decodedtoken:decodedtoken= jwt.verify(token,process.env.JWT_SECRET!) as decodedtoken;
        


    } catch (error:any) {
        console.log("error at protectedRoute",error.message);
        res.status(500).json({error:"internal server error"});
    }





}