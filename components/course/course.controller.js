import Course from "./course.model.js";
import User from "../user/user.model.js";
import randomstring from "randomstring";
import { sendInviteStudentEmail, sendInviteTeacherEmail } from "../../modules/nodemailer/index.js";

export default {
  getCourses: (req, res) => {
    const userId = req.user._id;

    //lay toan bo lop ma user co the la teacher hoac student
    Course.find({ $or: [{ author: userId }, { teachers: { $in: userId } }, { students: { $in: userId } }] })
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
      .or([{ teachers: { $in: userId } }, { students: { $in: userId } }])
      .lean()
      .exec(async (e, c) => {
        if (e) {
          return res.status(500).json({ message: e });
        }

        //neu khong co ket qua
        if (!(c && c._id)) {
          return res.status(202).json({ message: "You're not in the class!" });
        }

        const students = await User.find({ _id: { $in: c.students } });
        const teachers = await User.find({ _id: { $in: c.teachers } });

        c.students = students.map((s) => s.firstname + " " + s.lastname);
        c.teachers = teachers.map((s) => s.firstname + " " + s.lastname);

        return res.status(200).json({ payload: c });
      });
  },

  createCourse: (req, res) => {
    const author = req.user._id;
    const { name, details, briefName } = req.body;
    const code = randomstring.generate(7);

    Course.create(
      {
        author,
        teachers: [author],
        students: [],
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
    const code = req.query.code;

    Course.findOneAndUpdate({ code, students: { $ne: userId } }, { $push: { students: userId } }).exec((e, c) => {
      if (e) {
        return res.status(500).json({ message: e });
      }

      res.status(200).json({ payload: c, message: "You have successfully joined the course" });
    });
  },

  sendTeacherEmail: (req, res) => {
    sendInviteTeacherEmail(req.body.email, req.body.course, req.user).then((result) => {
      if (result) {
        res.status(200).json({ message: "SENT_SUCCESSFUL" });
      } else {
        res.status(200).json({ message: "SENT_FAILED" });
      }
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
