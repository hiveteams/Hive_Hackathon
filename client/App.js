import React from "react";
import { SecureStore } from "expo";
import { PhotoMapView } from "./src/components/MapView";
import { Realtime } from "./src/realtime";
import { Login } from "./src/components/Login";
import { Loading } from "./src/components/Loading";

const baseUrl = "http://dev1.hive.com";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      loggedIn: false,
    };

    this._initialize = this._initialize.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentWillMount() {
    this._initialize();
  }

  async _initialize() {
    const username = await SecureStore.getItemAsync("username");

    if (username) {
      Realtime.init({ url: baseUrl, username }, () => {
        this.setState({
          ready: true,
          loggedIn: true,
        });
      });
    } else {
      this.setState({
        ready: true,
        loggedIn: false,
      });
    }
  }

  handleLogin(username) {
    Realtime.init({ url: baseUrl, username }, () => {
      SecureStore.setItemAsync("username", username);
      this.setState({ ready: true, loggedIn: true });
    });
  }

  render() {
    // TODO: write the render logic

    // if App is not ready, render Loading component

    // if App is ready but the user is not logged in, render Login component
    // don't forget to pass in any necessary props!

    // If App is ready and user is logged in, render the PhotoMapView component

    return <Loading />;
  }
}
