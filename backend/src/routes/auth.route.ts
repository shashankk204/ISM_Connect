import  express  from "express";
import { GetMe, login, logout, signup } from "../controller/auth.controller.js";
import ProtectedRoute from "../middleware/protectedRoute.js";

const router=express.Router();


router.get("/me",ProtectedRoute,GetMe)
router.post("/signup",signup);
router.post("/login",login);
router.get("/logout",logout);


export default router;