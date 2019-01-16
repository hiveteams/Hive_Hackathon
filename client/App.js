import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PhotoMapView from "./src/components/PhotoMapView";
import { Realtime } from "./src/realtime";
import { Login } from "./src/components/Login";
import { SecureStore } from "expo";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      loggedIn: false
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
      Realtime.init({ url: "http://dev2.hive.com", username }, () =>
        this.setState({ ready: true, loggedIn: true })
      );
    } else {
      this.setState({ ready: true, loggedIn: false });
    }
  }

  handleLogin(username) {
    Realtime.init({ url: "http://dev2.hive.com", username }, () => {
      SecureStore.setItemAsync("username", username);
      this.setState({ ready: true, loggedIn: true });
    });
  }

  render() {
    if (!this.state.ready) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading...</Text>
        </View>
      );
    }

    if (!this.state.loggedIn) {
      return <Login onLogin={this.handleLogin} />;
    }

    return <PhotoMapView />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
