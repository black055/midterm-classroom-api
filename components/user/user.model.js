const mongoose = require('mongoose');

const Users = new mongoose.Schema({
    studentID: String,
    email: String,
    password: String,
    firstname: String,
    lastname: String,
    courses: Array,
    gender: String,
});

module.exports = mongoose.model("users", Users);