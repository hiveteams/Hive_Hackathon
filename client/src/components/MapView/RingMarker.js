import React from "react";
import PropTypes from "prop-types";
import { MapView } from "expo";
import { View } from "react-native";
import { colors } from "../../helpers/style-helpers";
import { styles } from "./map-view-styles";

class RingMarker extends React.PureComponent {
  render() {
    return (
      <MapView.Marker
        coordinate={this.props.coords}
        title={this.props.title}
        description={this.props.description}
        onPress={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        anchor={{ x: 0.5, y: 0.5 }}
        centerOffset={{ x: -12, y: -12 }}
      >
        <View
          style={[
            styles.ringOuter,
            {
              backgroundColor: this.props.backgroundColor,
              borderColor: this.props.color,
            },
          ]}
        >
          <View
            style={[styles.ringInner, { backgroundColor: this.props.color }]}
          />
        </View>
      </MapView.Marker>
    );
  }
}

RingMarker.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  coords: PropTypes.object.isRequired,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
};

RingMarker.defaultProps = {
  title: "",
  description: "",
  color: colors.primary,
  backgroundColor: colors.opaquePrimary,
};

export default RingMarker;
