import React from "react";
import PropTypes from "prop-types";
import { Platform, View, Text } from "react-native";
import { Constants, Location, Permissions, ImagePicker, MapView } from "expo";
import { Button } from "../Button";
import { Realtime, withRealtime } from "../../realtime";
import { colors } from "../../helpers/style-helpers";
import { PlaceOverlay } from "../PlaceOverlay";
import RingMarker from "./RingMarker";
import { styles } from "./map-view-styles";

const initialCoords = {
  latitude: 40.78476453140115,
  latitudeDelta: 0.1314237939850429,
  longitude: -73.96169615909457,
  longitudeDelta: 0.09279605001211166,
};

class PhotoMapView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null,
      mapMarkerLocation: null,
      selectedPlaceId: null,
    };

    this.onMapPress = this.onMapPress.bind(this);
    this.onUploadPhotoPress = this.onUploadPhotoPress.bind(this);
    this.getLocationAsync = this.getLocationAsync.bind(this);
  }

  componentWillMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!",
      });
    } else {
      this.getLocationAsync();
    }
  }

  onMapPress(e) {
    const coords = e.nativeEvent.coordinate;
    Realtime.updateCoords(coords);
    this.setState({
      mapMarkerLocation: coords,
    });
  }

  async onUploadPhotoPress() {
    const { mapMarkerLocation } = this.state;
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access camera roll was denied",
      });
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (result.cancelled) return;

    const place = await Realtime.createNewPlace(result, mapMarkerLocation);
    this.setState({ selectedPlaceId: place._id, mapMarkerLocation: null });
  }

  async getLocationAsync() {
    // Don't be creepy, ask for permissions
    // get location permissions
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied",
      });
    }

    // get users current location
    const location = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    this.setState(prevState => ({
      region: {
        ...prevState.region,
        ...coords,
      },
      mapMarkerLocation: coords,
    }));

    Realtime.updateCoords(coords);
  }

  render() {
    let messages = [];
    let selectedPlace = null;

    if (this.state.selectedPlaceId) {
      messages = this.props.messages
        .filter(m => m.placeId === this.state.selectedPlaceId)
        .sort((a, b) => a.createdAt - b.createdAt);
      selectedPlace = this.props.places.find(
        p => p._id === this.state.selectedPlaceId
      );
    }

    return (
      <>
        <MapView
          provider="google"
          style={styles.mapView}
          initialRegion={initialCoords}
          onPress={this.onMapPress}
          onPoiClick={this.onMapPress}
        >
          {this.props.users.map(u => (
            <RingMarker
              key={u._id}
              title={u.username}
              coords={u.coords}
              color={colors.green}
              backgroundColor={colors.opaqueGreen}
            />
          ))}
          {this.props.places.map(p => (
            <MapView.Marker
              key={p._id}
              coordinate={p.coords}
              pinColor={colors.black}
              title=""
              onPress={e => {
                e.preventDefault();
                e.stopPropagation();
                this.setState({ selectedPlaceId: p._id });
              }}
            />
          ))}
          {this.state.mapMarkerLocation && (
            <RingMarker
              title="Current Location"
              description="You are here"
              coords={this.state.mapMarkerLocation}
            />
          )}
        </MapView>
        <View style={styles.uploadButtonWrapper}>
          <Button
            onPress={this.onUploadPhotoPress}
            title="Upload photo"
            disabled={!this.state.mapMarkerLocation}
          />
        </View>
        {this.state.errorMessage && (
          <View style={styles.errorMessageWrapper}>
            <Text>{this.state.errorMessage}</Text>
          </View>
        )}
        {selectedPlace && (
          <PlaceOverlay
            place={selectedPlace}
            onHide={() => this.setState({ selectedPlaceId: null })}
            messages={messages}
          />
        )}
      </>
    );
  }
}

PhotoMapView.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object),
  places: PropTypes.arrayOf(PropTypes.object),
  users: PropTypes.arrayOf(PropTypes.object),
};

PhotoMapView.defaultProps = {
  messages: [],
  places: [],
  users: [],
};

export default withRealtime(PhotoMapView, "photoView");
