import { StyleSheet } from "react-native";
import { colors } from "../../helpers/style-helpers";

export const styles = StyleSheet.create({
  spinnerBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: colors.opaqueBlack,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
