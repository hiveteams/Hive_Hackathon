// import and run dotenv config at the very top
const dotenv = require("dotenv");
dotenv.config();

// import everything else
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const fileUpload = require("express-fileupload");
const { callMethod } = require("./src/server-methods");
const { User } = require("./src/users/users");
const { Place, createPlace } = require("./src/places/places");
const { Message } = require("./src/messages/messages");

const port = 3000;

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
// file uploads
app.use(fileUpload());
// server static files
app.use("/public", express.static("public"));

// setup mongoose
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
// connect to database
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true }
);

// hello world route
app.get("/", (req, res) => res.send("Hello World!"));

// upload route used to upload files and create a new place
app.post("/upload", (req, res, next) => {
  const uploadFile = req.files.photo;
  const fileName = req.files.photo.name;
  const { userId } = req.body;
  const coords = JSON.parse(req.body.coords);
  var randomId = mongoose.Types.ObjectId();
  const imageUrl = `public/files/${randomId}_${fileName}`;

  uploadFile.mv(`${__dirname}/${imageUrl}`, async err => {
    if (err) {
      return res.status(500).send(err);
    }

    const place = await createPlace(
      { userId, socket: io },
      {
        name: "New place",
        coords,
        imageUrl
      }
    );
    io.emit("placeUpdate", { place });
    res.send(place);
  });
});

// setup socket io handlers
io.on("connection", function(socket) {
  // on login, create / log user in and
  // start listening to socket messages
  socket.on("login", async username => {
    if (!username) {
      socket.disconnect();
      return;
    }

    const user = await callMethod({
      socket,
      method: "createUser",
      userId: null,
      data: { username }
    });
    const userId = user._id;

    // find all users
    const users = await User.find({ _id: { $ne: userId } }).exec();
    // find all places
    const places = await Place.find({}).exec();
    // find all messages
    const messages = await Message.find({}).exec();

    // confirm login for the client and respond with all the latest data
    socket.emit("login", { userId, users, places, messages });

    // on message, call the corresponding method
    socket.on("message", msg => {
      // parse the incoming message
      const message = JSON.parse(msg);
      // pull out the method and data from the client
      const { method, data } = message;
      // call the specified method
      callMethod({ socket, userId, method, data });
    });
  });
});

// start server
http.listen(port, () =>
  console.log(`Server started listening on port ${port}!`)
);
