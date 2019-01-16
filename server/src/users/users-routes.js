const { createUser } = require("./users");

const setupUserRoutes = app => {
  app.post("/create-user", async (req, res, next) => {
    const { username } = req.body;

    console.log("received req", username);
    if (!username) {
      res.status(500).send({ error: "Server encountered error" });
    }

    try {
      const user = await createUser({ username });
      res.send({ userId: user._id });
    } catch (err) {
      res.status(500).send({ error: "Server encountered error" });
    }
  });
};

module.exports = {
  setupUserRoutes
};
