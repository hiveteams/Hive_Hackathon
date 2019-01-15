import React from "react";
import PropTypes from "prop-types";
import { MapView } from "expo";
import { Platform, Text, View, StyleSheet } from "react-native";
import { Constants, Location, Permissions } from "expo";
import { Button } from "./Button";

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
      currentLocation: null
    };

    this.onMapPress = this.onMapPress.bind(this);
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
  };

  onMapPress(e) {
    const coords = e.nativeEvent.coordinate;
    this.setState({
      mapMarkerLocation: coords
    });
  }

  render() {
    return (
      <>
        <MapView
          provider="google"
          style={{ flex: 1 }}
          initialRegion={initialCoords}
          onPress={this.onMapPress}
          onPoiClick={this.onMapPress}
        >
          {this.state.mapMarkerLocation && (
            <MapView.Marker
              coordinate={this.state.mapMarkerLocation}
              title={"Current Location"}
              description={"You are here"}
              pinColor="#4990E2"
            />
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
            onPress={() => console.log("button pressed")}
            title="Upload photo"
          />
        </View>
      </>
    );
  }
}

PhotoMapView.propTypes = {};

PhotoMapView.defaultProps = {};

export default PhotoMapView;
