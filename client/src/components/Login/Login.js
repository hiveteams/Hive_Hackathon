import React from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import { Button } from "../Button";
import { TextInput } from "../TextInput";
import { styles } from "./login-styles";
import Users from "../../api/Users";

class Login extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      username: ""
    };
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 50 }}>
        <View style={styles.row}>
          <Text>Username</Text>
        </View>
        <View style={styles.row}>
          <TextInput
            onChangeText={username => this.setState({ username })}
            value={this.state.username}
            placeholder="Luke Skywalker"
          />
        </View>
        <View style={styles.row}>
          <Button
            title="Login"
            onPress={() => this.props.onLogin(this.state.username)}
          />
        </View>
      </View>
    );
  }
}

Login.propTypes = {
  onLogin: PropTypes.func
};

Login.defaultProps = {
  onLogin: () => {}
};

export default Login;
