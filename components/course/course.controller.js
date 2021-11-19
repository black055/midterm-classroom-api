import Course from "./course.model.js";
import User from "../user/user.model.js";
import randomstring from "randomstring";
import { sendInviteStudentEmail, sendInviteTeacherEmail } from "../../modules/nodemailer/index.js";

export default {
  getCourses: (req, res) => {
    const userId = req.user._id;

    //lay toan bo lop ma user co the la teacher hoac student
    Course.find({ $or: [{ owner: userId }, { teachers: { $in: userId } }, { students: { $in: userId } }] })
      .lean()
      .exec((e, r) => {
        if (e) {
          return res.status(500).json({ message: e });
        }

        return res.status(200).json({ payload: [...r] });
      });
  },

  getOneCourse: (req, res) => {
    const _id = req.params.id; //id cua lop cu the
    const userId = req.user._id;
    //lay mot lop ma user co the la teacher hoac student
    Course.findById(_id)
      .or([{ teachers: { $in: userId } }, { students: { $in: userId } }, { owner: userId }])
      .lean()
      .exec(async (e, c) => {
        if (e) {
          return res.status(500).json({ message: e });
        }
        //neu khong co ket qua
        if (!(c && c._id)) {
          return res.status(202).json({ message: "Không tìm thấy khoá học!" });
        }

        const students = await User.find({ _id: { $in: c.students } });
        const teachers = await User.find({ _id: { $in: c.teachers } });
        const owner = await User.findOne({ _id: c.owner });
        
        c.students = students.map((student) => ({
          _id: student._id,
          name: student.firstname + " " + student.lastname,
          email: student.email
        }));
        c.teachers = teachers.map((teacher) => ({
          _id: teacher._id,
          name: teacher.firstname + " " + teacher.lastname,
          email: teacher.email
        }));
        c.owner = {
          _id: owner._id,
          name: owner.firstname + " " + owner.lastname,
          email: owner.email
        }

        return res.status(200).json({ payload: c });
      });
  },

  getPublicInfoCourse: (req, res) => {
    const _id = req.params.id; //id cua lop cu the
    const userId = req.user._id;
    //lay mot lop ma user co the la teacher hoac student
    Course.findById(_id)
      .lean()
      .exec(async (e, c) => {
        if (e) {
          return res.status(500).json({ message: e });
        }
        
        //neu khong co ket qua
        if (!(c && c._id)) {
          return res.status(202).json({ message: "Không tìm thấy thông tin khoá học!" });
        }

        // Kiểm tra xem người dùng có trong khoá học chưa
        const isTeacher = c.teachers.some(function (teacher) {
          return teacher.equals(req.user._id);
        });
        const isStudent = c.students.some(function (student) {
          return student.equals(req.user._id);
        });
        if (c.owner.equals(req.user._id) || isTeacher || isStudent) {
          return res.status(202).json({ message: "ALREADY_IN" });
        }

        if (!req.query.code && !req.query.inviteCode) {
          return res.status(202).json({ message: "INVALID_INVITE_CODE" });
        }

        //Kiểm tra mã mời của khoá học của học sinh
        if (req.query.code && (req.query.code != c.code)){
          return res.status(202).json({ message: "INVALID_INVITE_CODE" });
        };
        
        //Kiểm tra mã mời của khoá học của giáo viên
        if (req.query.inviteCode && !c.inviteCode.includes(req.query.inviteCode)) {
          return res.status(202).json({ message: "INVALID_INVITE_CODE" });
        }

        const teachers = await User.find({ _id: { $in: c.teachers } });
        const owner = await User.findOne({ _id: c.owner });

        c.teachers = teachers.map((teacher) => ({
          _id: teacher._id,
          name: teacher.firstname + " " + teacher.lastname,
          email: teacher.email
        }));
        c.owner = {
          _id: owner._id,
          name: owner.firstname + " " + owner.lastname,
          email: owner.email
        }

        return res.status(200).json({ payload: {
          _id: c.id,
          name: c.name,
          details: c.details,
          briefName: c.briefName,
          teachers: c.teachers,
          owner: c.owner
        } });
      });
  },

  createCourse: (req, res) => {
    const owner = req.user._id;
    const { name, details, briefName } = req.body;
    const code = randomstring.generate(7);

    Course.create(
      {
        owner,
        teachers: [],
        students: [],
        inviteCode: [],
        name,
        details,
        code,
        briefName,
      },
      (e, c) => {
        if (e) {
          return res.status(500).json({ message: e });
        }

        res.status(200).json({ payload: c });
      }
    );
  },

  userJoinCourse: (req, res) => {
    const userId = req.user._id;
    const code = req.body.code;

    if (req.body.teacherInvite) {
      Course.findOneAndUpdate(
        { inviteCode: code, teachers: { $ne: userId } },
        { $pull: { inviteCode: code }, $push: { teachers: userId } }
      ).exec((e, c) => {
        if (e) {
          return res.status(500).json({ message: e });
        }
        res.status(200).json({ payload: c, message: "Tham gia lớp học thành công!" });
      });
    } else {
      Course.findOneAndUpdate(
        { code, students: { $ne: userId } },
        { $push: { students: userId } }
      ).exec((e, c) => {
        if (e) {
          
          return res.status(500).json({ message: e });
        }
        res.status(200).json({ payload: c, message: "Tham gia lớp học thành công!" });
      });
    }
  },

  sendTeacherEmail: (req, res) => {
    const inviteCode = randomstring.generate(12);
    Course.findOneAndUpdate(
      { _id: req.body.course._id },
      { $push: { inviteCode: inviteCode } }
    ).exec((e, c) => {
      if (e) {
        return res.status(500).json({ message: e });
      }
      sendInviteTeacherEmail(req.body.email, req.body.course, req.user, inviteCode).then((result) => {
        if (result) {
          res.status(200).json({ message: "SENT_SUCCESSFUL" });
        } else {
          res.status(200).json({ message: "SENT_FAILED" });
        }
      });
    });
  },

  sendStudentEmail: (req, res) => {
    sendInviteStudentEmail(req.body.email, req.body.course, req.user).then((result) => {
      if (result) {
        res.status(200).json({ message: "SENT_SUCCESSFUL" });
      } else {
        res.status(200).json({ message: "SENT_FAILED" });
      }
    });
  },
};
