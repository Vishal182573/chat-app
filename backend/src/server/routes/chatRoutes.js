import { Router } from "express";
import {addChat} from "../controllers/chatControllers.js"
const router = Router();

router.post('/addChat',addChat);

export default router;