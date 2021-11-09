const Course = require("./course.model");
const randomstring = require("randomstring");

module.exports = {
  getCourses: (req, res) => {
    const userId = req.header.user && req.header.user.id;

    //lay toan bo lop ma user co the la teacher hoac student
    Course.find()
      .or([{ teachers: { $in: userId } }, { students: { $in: userId } }])
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
    const userId = req.header.user && req.header.user.id;

    //lay mot lop ma user co the la teacher hoac student
    Course.find({ _id })
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
    const author = req.header.user && req.header.user.id;
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

        res.status(200).json({ item: c });
      }
    );
  },
};
