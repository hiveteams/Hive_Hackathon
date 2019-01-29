import React from "react";
import PropTypes from "prop-types";
import { Platform, View, Text } from "react-native";
import { Constants, Location, Permissions, MapView } from "expo";
import { Button } from "../Button";
import { Realtime, withRealtime } from "../../realtime";
import { colors } from "../../helpers/style-helpers";
import { Spinner } from "../Spinner";
import { styles } from "./map-view-styles";
import RingMarker from "./RingMarker";

const initialCoords = {
  latitude: 40.80791136891071,
  latitudeDelta: 0.013293344780677785,
  longitude: -73.96300239488482,
  longitudeDelta: 0.009485296905040741,
};

class PhotoMapView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null,
      currentLocation: null,
      showSpinner: false,
    };

    this.onMapPress = this.onMapPress.bind(this);
    this.getLocationAsync = this.getLocationAsync.bind(this);
  }

  componentWillMount() {
    // check to make sure the android device is not a simulator
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!",
      });
      return;
    }

    // get this users current location
    this.getLocationAsync();
  }

  onMapPress(e) {
    // grab the coords fromt he map press native event
    const coords = e.nativeEvent.coordinate;

    // TODO: use realtime helper to send coords to server

    // update local state
    this.setState({
      currentLocation: coords,
    });
  }

  async getLocationAsync() {
    // Don't be creepy, ask for permission
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

    // update state with the current location
    this.setState({
      currentLocation: coords,
    });

    // TODO: use realtime helper to send coords to server
  }

  render() {
    // filter out any users that do not have locations set yet
    const usersWithCoords = this.props.users.filter(u => !!u.coords);

    return (
      <>
        <MapView
          style={styles.mapView}
          initialRegion={initialCoords}
          onPress={this.onMapPress}
          onPoiClick={this.onMapPress}
        >
          {/* TODO: render other users with coords using the RingMarker component */}

          {this.state.currentLocation && (
            <RingMarker
              title="Current Location"
              description="You are here"
              coords={this.state.currentLocation}
            />
          )}
        </MapView>
        {this.state.errorMessage && (
          <View style={styles.errorMessageWrapper}>
            <Text>{this.state.errorMessage}</Text>
          </View>
        )}
        {this.state.showSpinner && <Spinner />}
      </>
    );
  }
}

PhotoMapView.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
};

PhotoMapView.defaultProps = {
  users: [],
};

export default withRealtime(PhotoMapView);
