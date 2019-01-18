const { registerMethod } = require("../server-methods");
const mongoose = require("mongoose");

// Create the mongoose model
const Place = mongoose.model("Place", {
  name: { type: String },
  coords: { latitude: Number, longitude: Number },
  imageUrl: { type: String },
  createdBy: { type: String }
});

/**
 * Create a new place
 * @param {Object} context
 * @param {String} context.userId - current user id
 * @param {Object} context.socket - socketio socket for this connection
 * @param {Object} data
 * @param {String} data.name - name
 * @param {Object} data.coords - coordinates
 * @param {String} data.imageUrl - relative imageUrl on this server
 */
const createPlace = async ({ userId, socket }, { name, coords, imageUrl }) => {
  // create and save a new place
  const place = new Place({ name, coords, imageUrl, createdBy: userId });
  await place.save();

  return place;
};
registerMethod({ method: "createPlace", callback: createPlace });

/**
 * Update the places name
 * @param {Object} context
 * @param {String} context.userId - current user id
 * @param {Object} context.socket - socketio socket for this connection
 * @param {Object} data
 * @param {String} data.name - name
 * @param {String} data.placeId - placeId
 */
const updatePlaceName = async ({ userId, socket }, { name, placeId }) => {
  // find existing place and update its name
  const place = await Place.findOneAndUpdate(
    { _id: placeId },
    { $set: { name } },
    { new: true }
  ).exec();

  // send update to all users
  socket.broadcast.emit("placeUpdate", { place });
  socket.emit("placeUpdate", { place });
  return place;
};
registerMethod({ method: "updatePlaceName", callback: updatePlaceName });

module.exports = {
  Place,
  createPlace
};
