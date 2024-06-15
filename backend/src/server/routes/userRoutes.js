import { Router } from "express";
import {LoginUser,RegisterUser,getAllUsers,getCurrentUser, getUsersByPrefix,addUserToContact,getContacts,getUsersByIds} from "../controllers/userController.js"
import ensureLoggedIn from "../middleware/authChecker.js"

const router = Router();

router.post('/login',LoginUser);
router.post('/register',RegisterUser);
router.post('/addUser',addUserToContact);
router.post('/getUsersByIds',getUsersByIds);

router.get('/getCurrentUser',getCurrentUser);
router.get('/getUsersByPrefix',getUsersByPrefix);
router.get('/getAllUsers',getAllUsers);
router.get('/getContacts',getContacts);

export default router;