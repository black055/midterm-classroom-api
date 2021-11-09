import User from './user.model.js';
import bcrypt from "bcryptjs";

export default {

  async getUser(email) {
      const result = await User.findOne({email: `${email}`});
      return result;
  },

  async getUserByID(_id) {   
    const result = await User.findOne({_id: `${_id}`});
    return result;
  },

  async addUser(user) {
      const checkExist = await User.find({email: `${user.email}`});
          if (checkExist.length) {
              // Email đã tồn tại
              return false;
          } else {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            const newUser = new User({
                email: user.email,
                password: hashedPassword,
                firstname: user.firstname,
                lastname: user.lastname,
                gender: user.gender,
                courses: []
            });
            newUser.save();
            return newUser;
      }
  }
}