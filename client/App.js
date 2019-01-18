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
    if (!this.state.ready) {
      return <Loading />;
    }

    if (!this.state.loggedIn) {
      return <Login onLogin={this.handleLogin} />;
    }

    return <PhotoMapView />;
  }
}
