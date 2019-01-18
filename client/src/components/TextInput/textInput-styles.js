import { StyleSheet } from "react-native";
import { colors } from "../../helpers/style-helpers";

export const styles = StyleSheet.create({
  input: {
    borderColor: colors.black,
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
    width: "100%"
  },
  titleInput: {
    borderColor: colors.accentDark,
    borderBottomWidth: 2,
    padding: 10,
    width: "100%"
  }
});
