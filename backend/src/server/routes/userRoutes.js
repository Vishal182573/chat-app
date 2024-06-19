import { Router } from "express";
import {LoginUser,RegisterUser, getUsersByPrefix,addUserToContact,getContacts,getUsersByIds,logoutUser,updateUser} from "../controllers/userController.js"

const router = Router();

router.post('/login',LoginUser);
router.post('/register',RegisterUser);
router.post('/addUser',addUserToContact);
router.post('/updateUser',updateUser);
router.post('/getUsersByIds',getUsersByIds);

router.get('/getUsersByPrefix',getUsersByPrefix);
router.get('/getContacts',getContacts);
router.get('/logout',logoutUser);

export default router;