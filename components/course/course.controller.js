import randomstring from "randomstring";
import {
  sendInviteStudentEmail,
  sendInviteTeacherEmail,
} from "../../modules/nodemailer/index.js";
import User from "../user/user.model.js";
import Course from "./course.model.js";

export default {
  getCourses: (req, res) => {
    const userId = req.user._id;

    //lay toan bo lop ma user co the la teacher hoac student
    Course.find({
      $or: [
        { owner: userId },
        { teachers: { $in: userId } },
        { students: { $in: userId } },
      ],
    })
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
      .or([
        { teachers: { $in: userId } },
        { students: { $in: userId } },
        { owner: userId },
      ])
      .lean()
      .exec(async (e, c) => {
        if (e) {
          return res.status(500).json({ message: e });
        }
        //neu khong co ket qua
        if (!(c && c._id)) {
          return res.status(202).json({ message: "Không tìm thấy khoá học!" });
        }

        //xac dinh role
        let role = "";
        if (c.students.some((id) => id.toString() === userId.toString())) {
          role = "STUDENT";
        } else if (
          c.teachers.some((id) => id.toString() === userId.toString())
        ) {
          role = "TEACHER";
        } else if (c.owner.toString() === userId.toString()) {
          role = "OWNER";
        }

        const students = await User.find({ _id: { $in: c.students } });
        const teachers = await User.find({ _id: { $in: c.teachers } });
        const owner = await User.findOne({ _id: c.owner });

        c.students = students.map((student) => ({
          _id: student._id,
          name: student.firstname + " " + student.lastname,
          email: student.email,
        }));
        c.teachers = teachers.map((teacher) => ({
          _id: teacher._id,
          name: teacher.firstname + " " + teacher.lastname,
          email: teacher.email,
        }));
        c.owner = {
          _id: owner._id,
          name: owner.firstname + " " + owner.lastname,
          email: owner.email,
        };

        return res.status(200).json({ payload: c, role: role });
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
          return res
            .status(202)
            .json({ message: "Không tìm thấy thông tin khoá học!" });
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
        if (req.query.code && req.query.code != c.code) {
          return res.status(202).json({ message: "INVALID_INVITE_CODE" });
        }

        //Kiểm tra mã mời của khoá học của giáo viên
        if (
          req.query.inviteCode &&
          !c.inviteCode.includes(req.query.inviteCode)
        ) {
          return res.status(202).json({ message: "INVALID_INVITE_CODE" });
        }

        const teachers = await User.find({ _id: { $in: c.teachers } });
        const owner = await User.findOne({ _id: c.owner });

        c.teachers = teachers.map((teacher) => ({
          _id: teacher._id,
          name: teacher.firstname + " " + teacher.lastname,
          email: teacher.email,
        }));
        c.owner = {
          _id: owner._id,
          name: owner.firstname + " " + owner.lastname,
          email: owner.email,
        };

        return res.status(200).json({
          payload: {
            _id: c.id,
            name: c.name,
            details: c.details,
            briefName: c.briefName,
            teachers: c.teachers,
            owner: c.owner,
          },
        });
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
        { inviteCode: code, teachers: { $ne: userId }, owner: { $ne: userId } },
        { $pull: { inviteCode: code }, $push: { teachers: userId } }
      ).exec((e, c) => {
        if (e) {
          return res.status(500).json({ message: e });
        }
        res
          .status(200)
          .json({ payload: c, message: "Tham gia lớp học thành công!" });
      });
    } else {
      Course.findOneAndUpdate(
        {
          code,
          students: { $ne: userId },
          teachers: { $ne: userId },
          owner: { $ne: userId },
        },
        { $push: { students: userId } }
      ).exec((e, c) => {
        if (e) {
          return res.status(500).json({ message: e });
        }

        if (!(c && c._id)) {
          return res
            .status(202)
            .json({ message: "Tham gia lớp học thất bại.." });
        }
        res
          .status(200)
          .json({ payload: c, message: "Tham gia lớp học thành công!" });
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
      sendInviteTeacherEmail(
        req.body.email,
        req.body.course,
        req.user,
        inviteCode
      ).then((result) => {
        if (result) {
          res.status(200).json({ message: "SENT_SUCCESSFUL" });
        } else {
          res.status(200).json({ message: "SENT_FAILED" });
        }
      });
    });
  },

  sendStudentEmail: (req, res) => {
    sendInviteStudentEmail(req.body.email, req.body.course, req.user).then(
      (result) => {
        if (result) {
          res.status(200).json({ message: "SENT_SUCCESSFUL" });
        } else {
          res.status(200).json({ message: "SENT_FAILED" });
        }
      }
    );
  },

  updateOneCourse: async (req, res) => {
    const _id = req.params.id;
    const userId = req.user._id;
    const { name, details, briefName } = req.body;

    const course = await Course.findOne({ _id: _id });

    const isTeacher = course.teachers.some((teacher) =>
      userId.equals(teacher._id)
    );
    const isOwner = userId.equals(course.owner);

    if (!(isTeacher || isOwner)) {
      return res.status(401).json({ message: "NO_PERMISSION" });
    }

    const role = isTeacher ? "TEACHER" : isOwner ? "OWNER" : "";

    Course.findByIdAndUpdate(
      _id,
      { name: name, details: details, briefName: briefName },
      { new: true },
      (err, crs) => {
        if (err) {
          return res.status(500).json({ message: err });
        } else {
          res.status(200).json({
            payload: crs,
            role: role,
            message: "UPDATE_SUCCESSFUL",
          });
        }
      }
    );
  },

  deleteOneCourse: async (req, res) => {
    const _id = req.params.id;
    const userId = req.user._id;

    const course = await Course.findOne({ _id: _id });
    const isOwner = userId.equals(course.owner);

    if (!isOwner) {
      return res.status(401).json({ message: "NO_PERMISSION" });
    }

    Course.findByIdAndRemove(_id, { new: true }, (err, docs) => {
      if (err) {
        return res.status(500).json({ message: err });
      } else {
        res.status(200).json({ message: "DELETE_SUCCESSFUL" });
      }
    });
  },
};
