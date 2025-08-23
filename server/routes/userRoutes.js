import express from 'express';
import { signup,updateProfile,login} from '../controllers/userController.js';
import { protectRoute,checkAuth } from '../middleware/auth.js';


const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.put('/update-profile', protectRoute, updateProfile);
userRouter.get('/check', protectRoute, checkAuth);


export default userRouter;