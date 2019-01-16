require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const { setupUserRoutes } = require("./src/users/users-routes");
const { callMethod } = require("./src/server-methods");
const { User } = require("./src/users/users");

const port = 3000;

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
// connect to database
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true }
);

console.log("Mongo connected");
app.get("/", (req, res) => res.send("Hello World!"));

setupUserRoutes(app);

// setup socket io handlers
io.on("connection", function(socket) {
  // on login, create / log user in and
  // start listening to socket messages
  socket.on("login", async username => {
    const user = await callMethod({
      socket,
      method: "createUser",
      userId: null,
      data: { username }
    });
    const userId = user._id;

    // find all users
    const users = await User.find({ _id: { $ne: userId } }).exec();

    socket.emit("login", { userId, users, places: [] });

    socket.on("message", msg => {
      const message = JSON.parse(msg);
      const { method, data } = message;
      callMethod({ socket, userId, method, data });
    });
  });
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`));
