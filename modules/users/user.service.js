import User from '../../models/user.model.js';

const createUser = async (userData) => {
   const user = new User(userData);
   await user.save();
   return user;
};

const getUsers = async () => {
   return User.find();
};

export default {
   createUser,
   getUsers,
};
