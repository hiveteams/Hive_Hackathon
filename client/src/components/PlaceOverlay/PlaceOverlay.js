import React from "react";
import PropTypes from "prop-types";
import { View, Image, Text, TouchableOpacity, FlatList } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "../Button";
import { TextInput } from "../TextInput";
import { Realtime } from "../../realtime";
import { MessageItem } from "../MessageItem";
import { styles } from "./place-overlay-styles";

class PlaceOverlay extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      placeName: props.place.name,
      messageText: "",
    };

    this.savePlaceName = this.savePlaceName.bind(this);
    this.sendButtonPressed = this.sendButtonPressed.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.place.name !== this.props.place.name) {
      this.setState({ placeName: nextProps.place.name });
    }
  }

  componentWillUnmount() {
    this.savePlaceName();
  }

  savePlaceName() {
    const { placeName } = this.state;
    if (placeName !== this.props.place.name) {
      Realtime.updatePlaceName({
        name: placeName,
        placeId: this.props.place._id,
      });
    }
  }

  sendButtonPressed() {
    const { place } = this.props;

    if (!this.state.messageText) return;

    Realtime.createMessage({
      text: this.state.messageText,
      placeId: place._id,
    });
    this.setState({ messageText: "" });
  }

  render() {
    const { place } = this.props;
    return (
      <View style={styles.overlayWrapper}>
        <View style={styles.overlayInner}>
          <Image
            style={styles.imageBanner}
            source={{ uri: `${Realtime.getUrl()}/${place.imageUrl}` }}
          />
          <TextInput
            style={styles.titleText}
            value={this.state.placeName}
            onChangeText={placeName => this.setState({ placeName })}
            onBlur={this.savePlaceName}
            titleInput
          />
          <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollView}
            enableOnAndroid
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
          >
            <FlatList
              inverted
              data={this.props.messages.reverse()}
              renderItem={({ item }) => <MessageItem message={item} />}
              keyExtractor={item => item._id}
            />
            <View style={styles.replyWrapper}>
              <View style={styles.replyInner}>
                <TextInput
                  placeholder="Message"
                  value={this.state.messageText}
                  onChangeText={messageText => this.setState({ messageText })}
                />
              </View>
              <View style={styles.sendWrapper}>
                <Button title="Send" onPress={this.sendButtonPressed} />
              </View>
            </View>
            <View style={styles.closeWrapper}>
              <TouchableOpacity
                style={styles.closeInner}
                onPress={this.props.onHide}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    );
  }
}

PlaceOverlay.propTypes = {
  place: PropTypes.object.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  onHide: PropTypes.func,
};

PlaceOverlay.defaultProps = {
  onHide: () => {},
};

export default PlaceOverlay;
