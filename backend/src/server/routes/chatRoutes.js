import { Router } from "express";
import {addChat,updateChat} from "../controllers/chatControllers.js"
const router = Router();

router.post('/addChat',addChat);
router.post('/updateChat',updateChat);

export default router;