import mongoose from 'mongoose';

const Course = new mongoose.Schema({
    owner: mongoose.Schema.Types.ObjectId,
    teachers: Array,
    students: Array,
    inviteCode: Array,
    name: String,
    details: String,
    code: String,
    briefName: String,
});

export default mongoose.model("course", Course, "course");