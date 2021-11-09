const mongoose = require('mongoose');

const Course = new mongoose.Schema({
    author: mongoose.Schema.Types.ObjectId,
    teachers: Array,
    students: Array,
    name: String,
    details: String,
    code: String,
    briefName: String,
});

module.exports = mongoose.model("course", Course);