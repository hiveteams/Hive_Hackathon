import React from "react";
import PropTypes from "prop-types";
import { Platform, View, Text } from "react-native";
import { Constants, Location, Permissions, ImagePicker, MapView } from "expo";
import { Button } from "../Button";
import { Realtime, withRealtime } from "../../realtime";
import { colors } from "../../helpers/style-helpers";
import { PlaceOverlay } from "../PlaceOverlay";
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
      selectedPlaceId: null,
      showSpinner: false,
    };

    this.onMapPress = this.onMapPress.bind(this);
    this.onUploadPhotoPress = this.onUploadPhotoPress.bind(this);
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

    // update user coords and update local state
    Realtime.updateCoords(coords);
    this.setState({
      currentLocation: coords,
    });
  }

  async onUploadPhotoPress() {
    const { currentLocation } = this.state;

    // get camera roll permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // show error if camera roll permission was denied
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access camera roll was denied",
      });
      return;
    }

    // launch image picker
    const result = await ImagePicker.launchImageLibraryAsync();
    if (result.cancelled) return;

    this.setState({ showSpinner: true });

    try {
      // create a new place using the image picker result
      const place = await Realtime.createNewPlace(result, currentLocation);
      this.setState({
        selectedPlaceId: place._id,
        currentLocation: null,
        showSpinner: false,
      });
    } catch (err) {
      this.setState({ showSpinner: false });
    }
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

    // realtime coordinate updates so other users see you move around
    Realtime.updateCoords(coords);
  }

  render() {
    // TODO: iterate over the list of places passed in by our realtime helper
    // to find the currently selected place
    console.log("selectedPlaceId", this.state.selectedPlaceId);

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
          {usersWithCoords.map(u => (
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
            >
              {/* used to hide callout on ios */}
              <MapView.Callout tooltip />
            </MapView.Marker>
          ))}
          {this.state.currentLocation && (
            <RingMarker
              title="Current Location"
              description="You are here"
              coords={this.state.currentLocation}
            />
          )}
        </MapView>
        <View style={styles.uploadButtonWrapper}>
          <Button
            onPress={this.onUploadPhotoPress}
            title="Upload photo"
            disabled={!this.state.currentLocation}
          />
        </View>
        {this.state.errorMessage && (
          <View style={styles.errorMessageWrapper}>
            <Text>{this.state.errorMessage}</Text>
          </View>
        )}

        {/*
          TODO: render PlaceOverlay
          Hint: you will need to pass in two props, place and onHide
          - place should be the object corresponding to selectedPlaceId
          - onHide should just trigger a state update that unsets selectedPlaceId

          You will also need to use the following syntax to only render the PlaceOverlay
          if there is a location currently selected

          {!!selectedPlace && <Component props />}
         */}

        {this.state.showSpinner && <Spinner />}
      </>
    );
  }
}

PhotoMapView.propTypes = {
  places: PropTypes.arrayOf(PropTypes.object),
  users: PropTypes.arrayOf(PropTypes.object),
};

PhotoMapView.defaultProps = {
  places: [],
  users: [],
};

export default withRealtime(PhotoMapView);
