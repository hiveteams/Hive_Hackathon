const { User } = require("../users/users");
const { registerMethod } = require("../server-methods");
const mongoose = require("mongoose");

// Create the mongoose model
const Message = mongoose.model("Message", {
  placeId: { type: String },
  text: { type: String },
  sentBy: { type: String },
  createdAt: { type: Date }
});

/**
 * Create a new message
 * @param {Object} context
 * @param {String} context.userId - current user id
 * @param {Object} context.socket - socketio socket for this connection
 * @param {Object} data
 * @param {String} data.placeId - the placeId where this message is posted
 * @param {String} data.text - the message text
 */
const createMessage = async ({ userId, socket }, { placeId, text }) => {
  // find the user
  const user = await User.findOne({ _id: userId }).exec();
  // create a new message
  const message = new Message({
    placeId,
    text,
    sentBy: user.username,
    createdAt: new Date()
  });
  // save the message to the db
  await message.save();

  // broadcaust the update to everyone else
  socket.broadcast.emit("messageUpdate", { message });
  // also send the update to the user who inserted the message
  socket.emit("messageUpdate", { message });
  return message;
};
registerMethod({ method: "createMessage", callback: createMessage });

module.exports = {
  Message,
  createMessage
};
