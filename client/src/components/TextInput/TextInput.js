import React from "react";
import PropTypes from "prop-types";
import { View, TextInput as RNTextInput } from "react-native";
import { styles } from "./textInput-styles";

class TextInput extends React.PureComponent {
  render() {
    return (
      <View style={this.props.titleInput ? styles.titleInput : styles.input}>
        <RNTextInput {...this.props} />
      </View>
    );
  }
}

TextInput.propTypes = {
  titleInput: PropTypes.bool,
};

TextInput.defaultProps = {
  titleInput: false,
};

export default TextInput;
