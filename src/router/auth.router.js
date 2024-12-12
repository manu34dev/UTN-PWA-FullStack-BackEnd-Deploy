import express from "express";
import { 
    LoginController, 
    registerUserController, 
    verifyMailValidationToken, 
    forgorPasswordController, 
    ResetTokenController} 
    from "../controllers/auth.controller.js";

const authRouter = express.Router()

authRouter.post('/register', registerUserController)
authRouter.get('/verify/:verification_Token', verifyMailValidationToken)
authRouter.post('/login', LoginController)
authRouter.post('/forgot-password', forgorPasswordController)
authRouter.put('/reset-password/:reset_token',ResetTokenController)

export default authRouter