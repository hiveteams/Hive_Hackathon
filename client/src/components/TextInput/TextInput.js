import React from "react";
import PropTypes from "prop-types";
import { styles } from "./textInput-styles";
import { Platform, View, TextInput as RNTextInput } from "react-native";

class TextInput extends React.PureComponent {
  render() {
    return (
      <View style={styles.input}>
        <RNTextInput {...this.props} />
      </View>
    );
  }
}

TextInput.propTypes = {};

TextInput.defaultProps = {};

export default TextInput;
