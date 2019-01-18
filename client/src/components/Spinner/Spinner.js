import React from "react";
import { View, ActivityIndicator } from "react-native";
import { colors } from "../../helpers/style-helpers";
import { styles } from "./spinner-styles";

const Spinner = () => (
  <View style={styles.spinnerBackground}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

export default Spinner;
