import React from "react";
import PropTypes from "prop-types";
import { View, Text, ImageBackground, Image } from "react-native";
import { Button } from "../Button";
import { TextInput } from "../TextInput";
import { styles } from "./login-styles";

const bgImage = require("../../../assets/onboarding-bg.png");
const logo = require("../../../assets/hive-logo-main.png");

class Login extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
    };
  }

  render() {
    return (
      <ImageBackground
        style={styles.loginContainer}
        source={bgImage}
        resizeMode="cover"
      >
        <View style={styles.loginCard}>
          <View style={styles.row}>
            <Text style={styles.loginTitle}>Realtime RN</Text>
          </View>
          <View style={styles.row}>
            <Text>Username</Text>
          </View>
          <View style={styles.row}>
            <TextInput
              onChangeText={username => {
                console.log(username);
                // update username
                this.setState({ username });
              }}
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

          <View style={styles.row}>
            <Image
              style={styles.logoImage}
              source={logo}
              resizeMode="contain"
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

Login.propTypes = {
  onLogin: PropTypes.func,
};

Login.defaultProps = {
  onLogin: () => {},
};

export default Login;
