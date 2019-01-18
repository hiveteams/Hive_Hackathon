import { StyleSheet } from "react-native";
import { colors } from "../../helpers/style-helpers";

export const styles = StyleSheet.create({
  mapView: {
    flex: 1,
  },
  uploadButtonWrapper: {
    position: "absolute",
    bottom: 25,
    width: 175,
    right: 25,
  },
  errorMessageWrapper: {
    position: "absolute",
    bottom: 100,
    width: "90%",
    right: 0,
    padding: 15,
    backgroundColor: colors.opaqueRed,
    borderColor: colors.red,
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: "5%",
  },
  ringOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: "absolute",
    borderWidth: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  ringInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
