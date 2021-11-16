import express from 'express';
const router = express.Router();

import authController from './auth.controller.js';
import passport from '../../modules/passport/index.js';

router.post('/login', passport.authenticate('local', {session: false}), authController.login);

router.post('/google', authController.google);

router.post('/register', authController.register);

export default router;
