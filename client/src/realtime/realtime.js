import SocketIOClient from "socket.io-client";

const connection = {
  username: null,
  userId: null,
  socket: null,
  url: null,
};

class Realtime {
  static init({ url, username }, onReady = () => {}) {
    // warn for duplicate socket initialization
    if (connection.socket) {
      console.warn(
        "Realtime socket already initialized, duplicate initialization ignored"
      );
      return;
    }

    if (!username) {
      console.warn("Realtime initialization error: Invalid username");
      return;
    }

    // create new socket io client
    const socket = SocketIOClient(url);
    connection.username = username;
    connection.socket = socket;
    connection.url = url;

    // listen for socket readiness
    socket.on("connect", () => {
      socket.emit("login", username);
    });

    socket.on("login", ({ userId }) => {
      // set connection userId
      connection.userId = userId;
      // trigger onReady callback
      onReady();
    });
  }

  static checkForInitialization() {
    if (!connection.socket) {
      throw new Error(
        "Realtime socket not initialized, please call Realtime.init before using socket"
      );
    } else if (!connection.userId) {
      throw new Error(
        "Realtime socket not ready, please wait for onReady callback before using socket"
      );
    }
  }

  static _sendMessage(method, data) {
    const msg = {
      userId: connection.userId,
      method,
      data,
    };
    connection.socket.send(JSON.stringify(msg));
  }

  static getUsername() {
    Realtime.checkForInitialization();

    return connection.username;
  }
}

export default Realtime;
