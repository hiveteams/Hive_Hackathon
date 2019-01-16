const { User } = require("../users/users");
const { registerMethod } = require("../server-methods");
const mongoose = require("mongoose");

const Message = mongoose.model("Message", {
  placeId: { type: String },
  text: { type: String },
  sentBy: { type: String },
  createdAt: { type: Date }
});

const createMessage = async ({ userId, socket }, { placeId, text }) => {
  const user = await User.findOne({ _id: userId }).exec();
  // otherwise create a user and return that instead
  const message = new Message({
    placeId,
    text,
    sentBy: user.username,
    createdAt: new Date()
  });
  await message.save();

  socket.broadcast.emit("messageUpdate", { message });
  socket.emit("messageUpdate", { message });
  return message;
};
registerMethod({ method: "createMessage", callback: createMessage });

module.exports = {
  Message,
  createMessage
};
