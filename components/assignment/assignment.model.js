const mongoose = require('mongoose');

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

module.exports = mongoose.model("assignment", Assignment);