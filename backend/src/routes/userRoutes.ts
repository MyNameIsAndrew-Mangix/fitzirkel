import express from 'express';
import * as userController from '../controllers/userController';
const router = express.Router();

router.post('/signup', userController.createUser);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

export default router;
