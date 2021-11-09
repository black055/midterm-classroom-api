import mongoose from 'mongoose';

const Course = new mongoose.Schema({
    author: mongoose.Schema.Types.ObjectId,
    teachers: Array,
    students: Array,
    name: String,
    details: String,
    code: String,
    briefName: String,
});

export default mongoose.model("course", Course);