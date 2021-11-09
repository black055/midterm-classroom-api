import express from 'express';
const router = express.Router();
import passport from 'passport';
import jwt from 'jsonwebtoken';
import constant from '../../config/constant.js';
import bcrypt from "bcryptjs";

import userController from '../user/user.controller.js'

import passportConfig from '../../config/passport.js';
passportConfig(passport);

router.post('/login', async function(req, res, next) {
    const user = await userController.getUser(req.body.email);
    if (user) {
        let check = false;
        check = await bcrypt.compareSync(req.body.password, user.password);
        if (check) {
            const token = jwt.sign({ _id: user._id }, constant.secret);
            return res.json({
                success: true,
                token: token
            });
        } else {
            res.status(401).send({success: false, msg: 'Mật khẩu không đúng.'});
        }
    } else res.status(401).send({success: false, msg: 'Email không đúng.'});
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
            success: true,
            token: token
        });
    } res.status(401).send({success: false, msg: 'Email đã tồn tại.'});
});

export default router;
