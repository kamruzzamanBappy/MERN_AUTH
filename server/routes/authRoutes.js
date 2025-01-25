// create express router

import express from 'express';
import { isAuthenticated, login, logout, register, sendVerifyOtp, verifyEmail } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';



const authRouter = express.Router();

authRouter.post('/register',register)
// addcontroller function,register
authRouter.post('/login',login)
// addcontroller function,login
authRouter.post('/logout',logout)
// addcontroller function, logout


authRouter.post('/send-verify-otp',userAuth,sendVerifyOtp)
//verify account using the ottp and add api end point & add conroller function verify email


authRouter.post('/verify-account',userAuth,verifyEmail)
authRouter.post('/is-auth',userAuth,isAuthenticated )

export default authRouter;