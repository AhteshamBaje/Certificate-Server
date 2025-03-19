import express from 'express';
import LoginApi from "../Controllers/LoginController.js";
import authMiddleware from '../auth.js/authMiddlewares.js';

const LoginRouter = express.Router();

LoginRouter.post('/login' , LoginApi);
LoginRouter.get('/protected' , authMiddleware , (req , res) => {
    res.json({ message: "Protected data accessed", user: req.user });

})

export default LoginRouter;