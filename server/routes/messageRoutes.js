import express from "express";
import { protectRoute} from "../middleware/auth.js";
import { getUserForSidebar, getMessages, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

const meassageRouter = express.Router();

meassageRouter.get("/users",protectRoute, getUserForSidebar);
meassageRouter.get("/:id", protectRoute, getMessages);
meassageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
meassageRouter.post("/send/:id", protectRoute, sendMessage);


export default meassageRouter;