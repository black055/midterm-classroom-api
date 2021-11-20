import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../user/user.model.js'
import bcrypt from "bcryptjs"

const client = new OAuth2Client("363623650683-5asnak0qhe873go03791oh3ln35uae26.apps.googleusercontent.com")
export default {
    login: (req, res, next) => {
        const token = jwt.sign({ _id: req.user._id }, process.env.AUTH_SECRET);
        res.json({
            token: token
        });
    },
    
    google: (req, res, next) => {
        const {tokenId} = req.body;
        client.verifyIdToken({ idToken: tokenId })
        .then(async function(data) {
            let user = await User.findOne({email: `${data.payload.email}`});
            if (!user) {
                user = new User({
                    email: data.payload.email,
                    password: "",
                    firstname: data.payload.given_name,
                    lastname: data.payload.family_name,
                    gender: 'Khác',
                    courses: []
                });
                user.save();
            }
            res.json({
                success: true,
                token: jwt.sign({ _id: user._id }, process.env.AUTH_SECRET)
            });
        }).catch(err => {
            res.status(401).json({message: "Không có quyền truy cập"});
        });
    },
    
    register: async (req, res, next) => {
        const user = await User.find({email: `${req.body.email}`});
        if (user.length) {
            return res.status(401).send({message: 'Email đã tồn tại.'});
        } 
        else {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const newUser = new User({
                email: req.body.email,
                password: hashedPassword,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                gender: req.body.gender ? req.body.gender : 'Khác',
                courses: []
            });
            newUser.save();
            return res.status(200).json({
                token: jwt.sign({ _id: newUser._id }, process.env.AUTH_SECRET)
            });;
        }
    }
}