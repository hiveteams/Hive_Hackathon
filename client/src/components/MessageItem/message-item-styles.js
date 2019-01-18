import { StyleSheet } from "react-native";
import { colors } from "../../helpers/style-helpers";

export const styles = StyleSheet.create({
  message: {
    margin: 5,
    padding: 10,
    backgroundColor: colors.lightGray,
    borderRadius: 5,
    opacity: 0.8,
  },
  messageText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
