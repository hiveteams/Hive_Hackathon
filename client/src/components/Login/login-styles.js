import { StyleSheet } from "react-native";
import { colors } from "../../helpers/style-helpers";

export const styles = StyleSheet.create({
  row: {
    marginBottom: 20,
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 15,
  },
  loginCard: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    elevation: 1,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: colors.black,
    shadowOpacity: 0.25,
  },
  loginTitle: {
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
  },
  logoImage: {
    width: "100%",
    height: 20,
    marginTop: 10,
  },
});
