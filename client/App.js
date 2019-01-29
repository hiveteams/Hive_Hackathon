import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Login } from "./src/components/Login";
import { Realtime } from "./src/realtime";

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    flex: 1,
    padding: 20,
  },
});

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
    };

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(username) {
    console.log("login clicked", username);

    // ignore if login is pressed without any username
    if (!username) return;

    // handle login logic by using our realtime helper to login through web socket
    const baseUrl = "http://dev1.hive.com";

    // TODO: Initialize Realtime helper using the init function, and update the 'loggedIn' state
  }

  render() {
    if (!this.state.loggedIn) {
      return <Login onLogin={this.handleLogin} />;
    }

    return (
      <View style={styles.container}>
        <Text>Welcome {Realtime.getUsername()}</Text>
        <Text>You are logged in!</Text>
      </View>
    );
  }
}
