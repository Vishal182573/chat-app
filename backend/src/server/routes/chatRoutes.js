import { Router } from "express";
import {addChat,updateChat} from "../controllers/chatControllers.js"
import ensureLoggedIn from "../middleware/authChecker.js";
const router = Router();

router.post('/addChat',ensureLoggedIn,addChat);
router.post('/updateChat',ensureLoggedIn,updateChat);

export default router;