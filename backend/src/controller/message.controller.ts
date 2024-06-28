import { Response,Request } from "express"
import prisma from "../db/prisma.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const SendMessage= async(req:Request,res:Response)=>
{
    try{
        const {message}=req.body;
        const recieverId=req.params.id;
        const senderId=req.user.id;
        let conversation=await prisma.conversation.findFirst({where:{
            participantIds:
            {
                hasEvery: [senderId,recieverId]
            }
        }})
        if(!conversation)
        {
            conversation =await prisma.conversation.create({
                data:{
                    participantIds:{
                        set:[senderId,recieverId]
                    }
                }
            })
        }
        const newMessage= await prisma.message.create({
            data:{
                senderId,
                body:message,
                conversationId:conversation.id
            }
        })
        if(newMessage)
        {
            conversation=await prisma.conversation.update({
                where:{id:conversation.id},
                data:{messages:
                    {
                        connect:{
                            id:newMessage.id
                        }
                    }
                }
            })
        }
        const receiverSocketId = getReceiverSocketId(recieverId);

		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}


        res.status(201).json(newMessage)
  
        
    }catch(error:any)
    {
        console.log("message not send",error.message);
        res.status(500).json({error:"internal server error"});
    }
}

export const GetMessages=async (req:Request,res:Response)=>
{
    try {
        const senderId=req.user.id;
        const recieverId=req.params.id;
        const conversation=await prisma.conversation.findFirst({where:{participantIds:{hasEvery:[senderId,recieverId]}}
        ,
        include:{
            messages:{
                orderBy:{
                    createdAt:"asc"
                }
            }
        }
    });
        if(!conversation)
        {
            res.status(200).json({});
        }
        res.status(200).json(conversation?.messages);
        
    } catch (error:any) {
        
        console.log("error at getmessage",error.message);
        res.json(500).json({error:"internal server error"});
        
    }
}

export const GetUsersForSideBar=async (req:Request,res:Response)=>
{
    try{
        const me=req.user.id;
        const users= await prisma.user.findMany({
            where:
            {
                id:{
                    not:me
                }
            },
            select: {
				id: true,
				fullName: true,
				profilePic: true,
			},
        })
        if(!users) 
        {
            return res.status(200).json({});
        }
        res.status(200).json(users);


    }catch (error:any) {
        
        console.log("error at getmessage",error.message);
        res.json(500).json({error:"internal server error"});
        
    }
}