import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PhotoMapView from "./src/components/PhotoMapView";
import { Realtime } from "./src/realtime";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false
    };
  }

  componentWillMount() {
    Realtime.init("http://localhost:3000", () =>
      this.setState({ ready: true })
    );
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
