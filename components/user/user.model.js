import mongoose from 'mongoose';

const User = new mongoose.Schema({
    email: { 
        type: String,
        required: true,
        unique: true
    },
    password: String,
    firstname: String,
    lastname: String,
    gender: {
        type: String,
        enum: ['Nam', 'Nữ', 'Khác']
    },
});

export default mongoose.model("user", User, "user");