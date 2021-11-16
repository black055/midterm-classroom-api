import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import userController from '../user/user.controller.js'

import passport from '../../modules/passport/index.js';

const client = new OAuth2Client("363623650683-5asnak0qhe873go03791oh3ln35uae26.apps.googleusercontent.com")

router.post('/login', passport.authenticate('local', {session: false}), async function(req, res, next) {
    const token = jwt.sign({ _id: req.user._id }, "nodeauthsecret");
    res.json({
        token: token
    });
});

router.post('/google', async function(req, res, next) {
    const {tokenId} = req.body;
    client.verifyIdToken({ idToken: tokenId })
    .then(async function(data) {
        const user = await userController.getUser(data.payload.email);
        if (user) res.json({
            success: true,
            token: jwt.sign({ _id: user._id }, 'secret')
        });
        else  res.json({
            success: false,
            payload: data.payload
        });
    }).catch(err => {
        res.status(401).json({message: "Unauthorized"});
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
        return res.status(200).json({
            token: jwt.sign({ _id: successful._id }, 'secret')
        });
    } res.status(401).send({message: 'Email đã tồn tại.'});
});

export default router;
