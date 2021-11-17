import Course from "./course.model.js";
import randomstring from "randomstring";

export default {
  getCourses: (req, res) => {
    const userId = req.headers.userId;

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
    const userId = req.headers.userId;

    //lay mot lop ma user co the la teacher hoac student
    Course.findById(_id)
      .or([{ teachers: { $in: userId } }, { students: { $in: userId } }])
      .lean()
      .exec((e, c) => {
        if (e) {
          return res.status(500).json({ message: e });
        }

        return res.status(200).json({ payload: c });
      });
  },

  createCourse: (req, res) => {
    const author = req.headers.userId;
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
    const userId = req.headers.userId;
    const code = req.query.code;

    Course.findOneAndUpdate({ code }, { $push: { students: userId } }).exec((e, c) => {
      if (e) {
        return res.status(500).json({ message: e });
      }

      res.status(200).json({ payload: c, message: "You have successfully joined the course" });
    });
  },
};
