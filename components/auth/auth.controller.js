import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../user/user.model.js'

const client = new OAuth2Client("363623650683-5asnak0qhe873go03791oh3ln35uae26.apps.googleusercontent.com")
export default {
    login: (req, res, next) => {
        const token = jwt.sign({ _id: req.user._id }, "secret");
        res.json({
            token: token
        });
    },
    
    google: (req, res, next) => {
        const {tokenId} = req.body;
        client.verifyIdToken({ idToken: tokenId })
        .then(async function(data) {
            const user = await User.findOne({email: `${data.payload.email}`});
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
    },
    
    register: async (req, res, next) => {
        const user = await User.find({email: `${user.email}`});
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
                token: jwt.sign({ _id: successful._id }, 'secret')
            });;
        }
    }
}