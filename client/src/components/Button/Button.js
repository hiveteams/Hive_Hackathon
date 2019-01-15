import React from "react";
import PropTypes from "prop-types";
import { styles } from "./button-styles";
import { Platform, View, Button as RNButton } from "react-native";
import { colors } from "../../helpers/style-helpers";

const color = Platform.OS === "android" ? colors.primary : colors.white;

class Button extends React.PureComponent {
  render() {
    return (
      <View style={styles.button}>
        <RNButton color={color} {...this.props} />
      </View>
    );
  }
}

Button.propTypes = {};

Button.defaultProps = {};

export default Button;
