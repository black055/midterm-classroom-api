import mongoose from "mongoose";

const User = new mongoose.Schema({
  studentID: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstname: String,
  lastname: String,
  courses: Array,
  gender: {
    type: String,
    enum: ["Nam", "Nữ", "Khác"],
  },
});

export default mongoose.model("user", User, "user");
