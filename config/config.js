import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import constant from './constant.js';

export default function config(app) {

    mongoose.connect(constant.database, 
    function (err) {
            if (err) throw err;
            console.log('Connect to database successful!');
        }, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }
    );

    app.use(cors());

    app.use(passport.initialize());
}