const { registerMethod } = require("../server-methods");
const mongoose = require("mongoose");

const User = mongoose.model("User", {
  username: { type: String, unique: true },
  coords: { latitude: Number, longitude: Number }
});

const createUser = async ({ userId, socket }, { username }) => {
  const existingUser = await User.findOne({ username }).exec();
  // return existing user if one exists
  if (existingUser) {
    return existingUser;
  }

  // otherwise create a user and return that instead
  const user = new User({ username });
  await user.save();
  return user;
};
registerMethod({ method: "createUser", callback: createUser });

const updateCoords = async ({ userId, socket }, { coords }) => {
  const user = await User.findOneAndUpdate(
    { _id: userId },
    { $set: { coords } },
    { new: true }
  ).exec();

  socket.broadcast.emit("userUpdate", { user });
  return user.coords;
};
registerMethod({ method: "updateCoords", callback: updateCoords });

module.exports = {
  User,
  createUser,
  updateCoords
};
