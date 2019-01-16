import React from "react";
import SocketIOClient from "socket.io-client";

const usersCache = {};
const placesCache = {};
const realtimeComponents = {};

export function withRealtime(WrappedComponent, id) {
  return class extends React.Component {
    constructor(props) {
      super(props);
    }

    componentDidMount() {
      // keep a ref to this realtime compnent
      realtimeComponents[id] = this;
    }

    componentWillUnmount() {
      delete realtimeComponents[id];
    }

    render() {
      return (
        <WrappedComponent
          users={Object.values(usersCache)}
          places={Object.values(placesCache)}
          {...this.props}
        />
      );
    }
  };
}

let connection = {
  username: null,
  userId: null,
  socket: null
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

    // create new socket io client
    const socket = SocketIOClient(url);
    connection.username = username;
    connection.socket = socket;

    // listen for socket readiness
    socket.on("connect", () => {
      socket.emit("login", username);
    });

    socket.on("login", ({ userId, users, places }) => {
      users.forEach(u => (usersCache[u._id] = u));
      places.forEach(p => (placesCache[p._id] = p));
      // set connection userId
      connection.userId = userId;
      // trigger onReady callback
      onReady();
    });

    // listen for userUpdates
    socket.on("userUpdate", ({ user }) => {
      // update users cache
      usersCache[user._id] = user;

      const components = Object.values(realtimeComponents);
      components.forEach(c => c.forceUpdate());
    });

    // listen for place updates
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

  static sendMessage(method, data) {
    const msg = {
      userId: connection.userId,
      method,
      data
    };
    connection.socket.send(JSON.stringify(msg));
  }

  static updateCoords(coords) {
    Realtime.checkForInitialization();

    const data = {
      coords
    };

    Realtime.sendMessage("updateCoords", data);
  }
}

export default Realtime;
