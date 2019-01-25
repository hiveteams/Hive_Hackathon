import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "./src/components/Button";

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
      count: 0,
    };

    this.handleButtonPress = this.handleButtonPress.bind(this);
  }

  handleButtonPress() {
    // Not a good idea
    // this.setState({ count: this.state.count + 1 });

    // Better
    this.setState(prevState => {
      // use prev state to calculate next state's count
      const count = prevState.count + 1;

      // return the updated count
      return {
        count,
      };
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Button title="Click Me" onPress={this.handleButtonPress} />
        <Text>Button pressed {this.state.count}</Text>
      </View>
    );
  }
}
