import express from 'express'
import ProtectedRoute from '../middleware/protectedRoute.js';
import { SendMessage,GetMessages,GetUsersForSideBar } from '../controller/message.controller.js';

const router=express.Router();


router.get("/conversations",ProtectedRoute,GetUsersForSideBar);
router.post("/send/:id",ProtectedRoute,SendMessage);
router.get('/:id',ProtectedRoute,GetMessages);


export default router;