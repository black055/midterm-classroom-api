import mongoose from 'mongoose';

const Assignment = new mongoose.Schema({
    course: mongoose.Schema.Types.ObjectID,
    name: String,
    details: String,
    gradeWeight: Number,
    grades: Array,
    /*
    grades: [
        Object {
            studentID: String
            grade: Number
        }
    ]
    */
});

export default mongoose.model("assignment", Assignment);