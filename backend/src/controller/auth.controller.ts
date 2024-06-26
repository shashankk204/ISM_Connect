import { Request,Response } from "express"
import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs"
import genprofilepic from "../utils/auth.controller.util.js";
import generatoken from "../utils/generateToken.js";


export const signup =async(req:Request,res:Response)=>
{
    try {
        const {fullName,username,password,confirmPassword,gender}=req.body;
        if(!fullName || !username || !password || !confirmPassword || !gender)
        {
            return res.status(400).json({error:"please fill in all fields"});
        }
        if(password!==confirmPassword) 
        {
            return res.status(400).json({error:"Password don't match"});
        }

        const user= await prisma.user.findUnique({where:{username}})

        if(user) return res.status(400).json({error:"Username already exists"});

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword=await bcryptjs.hash(password,salt);
        const profilePic=genprofilepic(fullName);

        const newuser=await prisma.user.create(
            {
                data:{
                    fullName,
                    gender,
                    password:hashedPassword,
                    profilePic,
                    username,
                }
            }
        );
        if(newuser)
        {
            const token=generatoken(newuser.username,res);
            res.status(201).json({
                id:newuser.id,
                fullName:newuser.fullName,
                username:newuser.username,
                profilePic:newuser.profilePic
            })
        }
        else
        {
            res.status(400).json({error:"invalid user data"});
        }


        
    } catch (error:any) {
        console.log("error in signup controller",error.message);
        res.status(500).json({error:"internal server error"});
        
    }
}




export const login =async(req:Request,res:Response)=>
{
    try {
        const {username,password}=req.body;

        const user=await prisma.user.findUnique({where:{username}});
        if(!user){
            return res.status(400).json({error:"Invalid Credentials"});
        }        
        let checkpassword=await bcryptjs.compare(password,user.password);
        if(!checkpassword)
        {
            return res.status(400).json({error:"Invalid Credentials"});
        }

        generatoken(user.username,res);
        res.status(200).json(
            {
                id:user.id,
                fullName:user.fullName,
                username:user.username,
                profilePic:user.profilePic
            }
        )
    } catch (error:any) {
        console.log("error in login controller",error.message);
        res.status(500).json({error:"internal server error"});
        
    }
}

export const logout =async(req:Request,res:Response)=>
{
    try {
        res.cookie("token",{},{maxAge:0});
        res.status(200).json({message:"logged out Successfully"});
        
    } catch (error:any) {
        console.log("error in logout controller",error.message);
        res.status(500).json({error:"internal server error"});
        
        
    }

}




export const GetMe= async()=>{
    
}