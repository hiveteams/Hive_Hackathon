const { registerMethod } = require("../server-methods");
const mongoose = require("mongoose");

const Place = mongoose.model("Place", {
  name: { type: String },
  coords: { latitude: Number, longitude: Number },
  imageUrl: { type: String },
  createdBy: { type: String }
});

const createPlace = async ({ userId, socket }, { name, coords, imageUrl }) => {
  // otherwise create a user and return that instead
  const place = new Place({ name, coords, imageUrl, createdBy: userId });
  await place.save();

  return place;
};
registerMethod({ method: "createPlace", callback: createPlace });

const updatePlaceName = async ({ userId, socket }, { name, placeId }) => {
  const place = await Place.findOneAndUpdate(
    { _id: placeId },
    { $set: { name } },
    { new: true }
  ).exec();

  console.log(place);
  socket.broadcast.emit("placeUpdate", { place });
  socket.emit("placeUpdate", { place });
  return place;
};
registerMethod({ method: "updatePlaceName", callback: updatePlaceName });

module.exports = {
  Place,
  createPlace
};
