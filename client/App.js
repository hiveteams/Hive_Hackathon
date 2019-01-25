import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "./src/components/Button";

const rowStyle = {
  flex: 1,
};

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
  blue: {
    ...rowStyle,
    backgroundColor: "blue",
  },
  cyan: {
    ...rowStyle,
    backgroundColor: "cyan",
  },
});

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleButtonPress = this.handleButtonPress.bind(this);
  }

  handleButtonPress() {
    console.log("button pressed");
  }

  render() {
    return (
      <View style={styles.container}>
        <Button title="Click Me" onPress={this.handleButtonPress} />
      </View>
    );
  }
}
