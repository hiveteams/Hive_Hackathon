import React from "react";
import { View, Text } from "react-native";
import { styles } from "./loading-styles";

const Loading = () => (
  <View style={styles.loadingWrapper}>
    <Text>Loading...</Text>
  </View>
);

export default Loading;
