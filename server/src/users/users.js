const { registerMethod } = require("../server-methods");
const mongoose = require("mongoose");

// Create the mongoose model
const User = mongoose.model("User", {
  username: { type: String, unique: true },
  coords: { latitude: Number, longitude: Number }
});

/**
 * Create a new user or return existing user
 * @param {Object} context
 * @param {String} context.userId - current user id
 * @param {Object} context.socket - socketio socket for this connection
 * @param {Object} data
 * @param {String} data.username - username
 */
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

/**
 * Update existing user coordinates
 * @param {Object} context
 * @param {String} context.userId - current user id
 * @param {Object} context.socket - socketio socket for this connection
 * @param {Object} data
 * @param {String} data.coords - coordinates for this users new position
 */
const updateCoords = async ({ userId, socket }, { coords }) => {
  // find existing user
  const user = await User.findOneAndUpdate(
    { _id: userId },
    { $set: { coords } },
    { new: true }
  ).exec();

  // send update to all other users
  socket.broadcast.emit("userUpdate", { user });
  return user.coords;
};
registerMethod({ method: "updateCoords", callback: updateCoords });

module.exports = {
  User,
  createUser,
  updateCoords
};
