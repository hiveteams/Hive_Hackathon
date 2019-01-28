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