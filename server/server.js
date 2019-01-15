const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));

io.on("connection", function(socket) {
  console.log("a user connected");

  socket.on("message", msg => console.log("message", msg));
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`));
