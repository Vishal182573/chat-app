import { Router } from "express";
import {LoginUser,RegisterUser,getAllUsers,getCurrentUser, getUsersByPrefix,getUserEmail} from "../controllers/userController.js"
import ensureLoggedIn from "../middleware/authChecker.js"

const router = Router();

router.post('/login',LoginUser);
router.post('/register',RegisterUser);

router.get('/getCurrentUser',getCurrentUser);
router.get('/getUsersByPrefix',getUsersByPrefix);
router.get('/getAllUsers',getAllUsers);
router.get('/getUserEmail',ensureLoggedIn,getUserEmail);

export default router;