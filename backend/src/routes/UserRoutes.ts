import express from 'express';
import * as UserController from '../controllers/UserController';
const router = express.Router();

router.post('/signup', UserController.createUser);
// router.post('/login', UserController.login);
// router.post('/logout', UserController.logout);

export default router;
