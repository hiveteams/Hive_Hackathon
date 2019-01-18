import React from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import { styles } from "./message-item-styles";

class MessageItem extends React.PureComponent {
  render() {
    const { message } = this.props;
    return (
      <View style={styles.message}>
        <Text style={styles.messageText}>{message.sentBy}</Text>
        <Text>{message.text}</Text>
      </View>
    );
  }
}

MessageItem.propTypes = {
  message: PropTypes.object.isRequired,
};

MessageItem.defaultProps = {};

export default MessageItem;
