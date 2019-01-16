import React from "react";
import PropTypes from "prop-types";
import { View, Image, Dimensions, Text, TouchableOpacity } from "react-native";
import { Button } from "../Button";
import { TextInput } from "../TextInput";
import { colors } from "../../helpers/style-helpers";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Realtime from "../../realtime/realtime";

class PlaceOverlay extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      placeName: props.place.name,
      messageText: ""
    };

    this.savePlaceName = this.savePlaceName.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.place.name !== this.props.place.name) {
      this.setState({ placeName: nextProps.place.name });
    }
  }

  savePlaceName() {
    const placeName = this.state.placeName;
    if (placeName !== this.props.place.name) {
      Realtime.updatePlaceName({
        name: placeName,
        placeId: this.props.place._id
      });
    }
  }

  render() {
    const { place } = this.props;
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: colors.white
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: colors.white,
            display: "flex",
            flex: 1
          }}
        >
          <Image
            style={{ width: "100%", height: 300 }}
            source={{ uri: `http://dev2.hive.com/${place.imageUrl}` }}
          />
          <View>
            <TextInput
              style={{ fontSize: 30, fontWeight: "bold" }}
              value={this.state.placeName}
              onChangeText={placeName => this.setState({ placeName })}
              onBlur={this.savePlaceName}
            />
          </View>
          <KeyboardAwareScrollView
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 15,
              display: "flex",
              flex: 1
            }}
            enableOnAndroid
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end"
              }}
            >
              {this.props.messages.map(m => (
                <Text key={m._id}>
                  {m.sentBy}: {m.text}
                </Text>
              ))}
            </View>
            <View
              style={{
                marginBottom: 15,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <View style={{ flex: 1 }}>
                <TextInput
                  placeholder="Message"
                  value={this.state.messageText}
                  onChangeText={messageText => this.setState({ messageText })}
                />
              </View>
              <View
                style={{
                  width: 100,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 5
                }}
              >
                <Button
                  title="Send"
                  onPress={() => {
                    if (!this.state.messageText) return;

                    Realtime.createMessage({
                      text: this.state.messageText,
                      placeId: place._id
                    });
                    this.setState({ messageText: "" });
                  }}
                />
              </View>
            </View>
            <View
              style={{
                marginBottom: 15
              }}
            >
              <TouchableOpacity
                style={{ width: "100%" }}
                onPress={this.props.onHide}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    color: colors.gray
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    );
  }
}

PlaceOverlay.propTypes = {};

PlaceOverlay.defaultProps = {};

export default PlaceOverlay;
