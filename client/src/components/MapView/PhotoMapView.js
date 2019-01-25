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
      mapMarkerLocation: null,
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
      mapMarkerLocation: coords,
    });
  }

  async onUploadPhotoPress() {
    const { mapMarkerLocation } = this.state;

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
      const place = await Realtime.createNewPlace(result, mapMarkerLocation);
      this.setState({
        selectedPlaceId: place._id,
        mapMarkerLocation: null,
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
    this.setState(prevState => ({
      region: {
        ...prevState.region,
        ...coords,
      },
      mapMarkerLocation: coords,
    }));

    // realtime coordinate updates so other users see you move around
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

    // filter out any users that do not have locations set yet
    const usersWithCoords = this.props.users.filter(u => !!u.coords);

    return (
      <>
        <MapView
          ref={m => (this.mapView = m)}
          provider="google"
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
        {this.state.showSpinner && <Spinner />}
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

export default withRealtime(PhotoMapView);
