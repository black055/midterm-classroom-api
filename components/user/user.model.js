import mongoose from 'mongoose';

const Users = new mongoose.Schema({
    studentID: String,
    email: String,
    password: String,
    firstname: String,
    lastname: String,
    courses: Array,
    gender: String,
});

export default mongoose.model("users", Users);