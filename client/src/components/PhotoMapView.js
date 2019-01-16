import React from "react";
import PropTypes from "prop-types";
import { MapView } from "expo";
import { Platform, Text, View, StyleSheet } from "react-native";
import { Constants, Location, Permissions, ImagePicker } from "expo";
import { Button } from "./Button";
import { Realtime, withRealtime } from "../realtime";
import { colors } from "../helpers/style-helpers";
import PlaceOverlay from "./PlaceOverlay/PlaceOverlay";

const initialCoords = {
  latitude: 40.78476453140115,
  latitudeDelta: 0.1314237939850429,
  longitude: -73.96169615909457,
  longitudeDelta: 0.09279605001211166
};

class PhotoMapView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      location: null,
      error: null,
      mapMarkerLocation: null,
      currentLocation: null,
      selectedPlaceId: null
    };

    this.onMapPress = this.onMapPress.bind(this);
    this.onUploadPhotoPress = this.onUploadPhotoPress.bind(this);
  }

  componentWillMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    // Don't be creepy, ask for permissions
    // get location permissions
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    // get users current location
    let location = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    };

    this.setState(prevState => ({
      region: {
        ...prevState.region,
        ...coords
      },
      currentLocation: coords,
      mapMarkerLocation: coords
    }));

    Realtime.updateCoords(coords);
  };

  onMapPress(e) {
    const coords = e.nativeEvent.coordinate;
    Realtime.updateCoords(coords);
    this.setState({
      mapMarkerLocation: coords
    });
  }

  async onUploadPhotoPress() {
    let { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access camera roll was denied"
      });
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (result.cancelled) return;

    const place = await Realtime.createNewPlace(
      result,
      this.state.mapMarkerLocation
    );
    this.setState({ selectedPlaceId: place._id, mapMarkerLocation: null });
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
          style={{ flex: 1 }}
          initialRegion={initialCoords}
          onPress={this.onMapPress}
          onPoiClick={this.onMapPress}
        >
          {this.props.users.map(u => (
            <MapView.Marker
              key={u._id}
              coordinate={u.coords}
              title={u.username}
              pinColor={colors.accent}
              onPress={e => {
                console.log("user pressed");
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: colors.accentDark,
                  borderRadius: 20,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              />
            </MapView.Marker>
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
            <MapView.Marker
              coordinate={this.state.mapMarkerLocation}
              title={"Current Location"}
              description={"You are here"}
              pinColor="#4990E2"
              onPress={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: colors.primary,
                  borderRadius: 20,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              />
            </MapView.Marker>
          )}
        </MapView>
        <View
          style={{
            position: "absolute",
            bottom: 25,
            width: 175,
            right: 25
          }}
        >
          <Button
            onPress={this.onUploadPhotoPress}
            title="Upload photo"
            disabled={!this.state.mapMarkerLocation}
          />
        </View>
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

PhotoMapView.propTypes = {};

PhotoMapView.defaultProps = {};

export default withRealtime(PhotoMapView, "photoView");
