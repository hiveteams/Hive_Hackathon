import { StyleSheet } from "react-native";
import { colors } from "../../helpers/style-helpers";

export const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    borderRadius: 2
  }
});
