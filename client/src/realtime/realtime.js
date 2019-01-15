import SocketIOClient from "socket.io-client";

let _socket = null;
class Realtime {
  static init(url, onReady = () => {}) {
    // warn for duplicate socket initialization
    if (_socket) {
      console.warn(
        "Realtime socket already initialized, duplicate initialization ignored"
      );
      return;
    }

    // create new socket io client
    _socket = SocketIOClient("http://localhost:3000");

    // listen for socket readiness
    _socket.on("connect", onReady);

    // listen for socket messages
    _socket.on("message", msg => console.log(msg));
  }

  static checkForInitialization() {
    if (!_socket) {
      throw new Error(
        "Realtime socket not initialized, please call Realtime.init before using socket"
      );
    } else if (!_socket.id) {
      throw new Error(
        "Realtime socket not ready, please wait for onReady callback before using socket"
      );
    }
  }

  static sendMessage(data) {
    _socket.send(JSON.stringify(data));
  }

  static updateUserLocation(location) {
    Realtime.checkForInitialization();

    const data = {
      msg: "location",
      location
    };

    Realtime.sendMessage(data);
  }
}

export default Realtime;
