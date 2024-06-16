import { Router } from "express";
import {LoginUser,RegisterUser,getAllUsers,getCurrentUser, getUsersByPrefix,getUserEmail,addUserToContact,getContacts,getUsersByIds,logoutUser} from "../controllers/userController.js"
import ensureLoggedIn from "../middleware/authChecker.js"

const router = Router();

router.post('/login',LoginUser);
router.post('/register',RegisterUser);
router.post('/addUser',ensureLoggedIn,addUserToContact);
router.post('/getUsersByIds',ensureLoggedIn,getUsersByIds);

router.get('/getCurrentUser',ensureLoggedIn,getCurrentUser);
router.get('/getUsersByPrefix',ensureLoggedIn,getUsersByPrefix);
router.get('/getAllUsers',ensureLoggedIn,getAllUsers);
router.get('/getContacts',ensureLoggedIn,getContacts);
router.get('/getUserEmail',ensureLoggedIn,getUserEmail);
router.get('/logout',ensureLoggedIn,logoutUser);

export default router;