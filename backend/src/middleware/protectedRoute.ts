import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../db/prisma.js";

interface decodedtoken extends JwtPayload
{
    UserId:string
}

declare global
{
    namespace Express{
        export interface Request
        {
            user:
            {
                id:string
            }
        }
    }
}

export default async function ProtectedRoute(req:Request,res:Response,next:NextFunction)
{
    try {
        const token=req.cookies.token;
        
        if(!token)
        {
            return res.status(400).json({error:"unauthorized access"});
        }

        
        try {
            const {UserId} = jwt.verify(token,process.env.JWT_SECRET!) as decodedtoken
            
            const queryuser=await prisma.user.findUnique({where:{id:UserId},select:{id: true}});
            if(!queryuser) {
                return res.status(400).json({error:"user don't exists"});
            }
            req.user=queryuser;

            next();
            
        } catch (error:any) {
            return res.status(400).json({error:"invalid token"})
            
        }
        


    } catch (error:any) {
        console.log("error at protectedRoute",error.message);
        res.status(500).json({error:"internal server error"});
    }





}