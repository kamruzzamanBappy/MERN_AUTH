// create express router

import express from 'express';
import { login, logout, register } from '../controllers/authController.js';



const authRouter = express.Router();

authRouter.post('/register',register)
// addcontroller function,register
authRouter.post('/login',login)
// addcontroller function,login
authRouter.post('/logout',logout)
// addcontroller function, logout

export default authRouter;