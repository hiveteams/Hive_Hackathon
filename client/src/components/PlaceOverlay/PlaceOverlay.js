import React from "react";
import PropTypes from "prop-types";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { TextInput } from "../TextInput";
import { Realtime } from "../../realtime";
import { styles } from "./place-overlay-styles";

class PlaceOverlay extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      placeName: props.place.name,
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
    // TODO: write logic for savePlaceName using the Realtime helper
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
          <View style={styles.closeWrapper}>
            <TouchableOpacity
              style={styles.closeInner}
              onPress={this.props.onHide}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

PlaceOverlay.propTypes = {
  place: PropTypes.object.isRequired,
  onHide: PropTypes.func,
};

PlaceOverlay.defaultProps = {
  onHide: () => {},
};

export default PlaceOverlay;
