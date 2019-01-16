import React from "react";
import SocketIOClient from "socket.io-client";

const usersCache = {};
const placesCache = {};
const messagesCache = {};
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
          messages={Object.values(messagesCache)}
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

    socket.on("login", ({ userId, users, places, messages }) => {
      users.forEach(u => (usersCache[u._id] = u));
      places.forEach(p => (placesCache[p._id] = p));
      messages.forEach(m => (messagesCache[m._id] = m));
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
    socket.on("placeUpdate", ({ place }) => {
      // update places cache
      placesCache[place._id] = place;

      const components = Object.values(realtimeComponents);
      components.forEach(c => c.forceUpdate());
    });

    // listen for message updates
    socket.on("messageUpdate", ({ message }) => {
      // update messages cache
      messagesCache[message._id] = message;

      const components = Object.values(realtimeComponents);
      components.forEach(c => c.forceUpdate());
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
      data
    };
    connection.socket.send(JSON.stringify(msg));
  }

  static updateCoords(coords) {
    Realtime.checkForInitialization();

    const data = {
      coords
    };

    Realtime._sendMessage("updateCoords", data);
  }

  static async createNewPlace(result, coords) {
    // ImagePicker saves the taken photo to disk and returns a local URI to it
    let localUri = result.uri;
    let filename = localUri.split("/").pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    // Assume "photo" is the name of the form field the server expects
    formData.append("photo", { uri: localUri, name: filename, type });
    formData.append("userId", connection.userId);
    formData.append("coords", JSON.stringify(coords));

    const res = await fetch("http://dev2.hive.com/upload", {
      method: "POST",
      body: formData,
      header: {
        "content-type": "multipart/form-data"
      }
    });
    const place = await res.json();
    return place;
  }

  static createMessage({ text, placeId }) {
    Realtime.checkForInitialization();

    const data = {
      text,
      placeId
    };

    Realtime._sendMessage("createMessage", data);
  }

  static updatePlaceName({ name, placeId }) {
    Realtime.checkForInitialization();

    const data = {
      name,
      placeId
    };

    Realtime._sendMessage("updatePlaceName", data);
  }
}

export default Realtime;
