import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';

import userController from '../user/user.controller.js'

import passport from '../../modules/passport/index.js';

router.post('/login', passport.authenticate('local', {session: false}), async function(req, res, next) {
    const token = jwt.sign({ _id: req.user._id }, "nodeauthsecret");
    res.json({
        token: token
    });
});

router.post('/register', async function(req, res, next) {
    const successful = await userController.addUser({
        email: req.body.email,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        gender: req.body.gender
    });
    if (successful) {
        const token = jwt.sign({ _id: successful._id }, 'secret');
        return res.json({
            token: token
        });
    } res.status(401).send({message: 'Email đã tồn tại.'});
});

export default router;
