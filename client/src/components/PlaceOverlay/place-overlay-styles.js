import { StyleSheet } from "react-native";
import { colors } from "../../helpers/style-helpers";

export const styles = StyleSheet.create({
  overlayWrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    backgroundColor: colors.white,
  },
  overlayInner: {
    width: "100%",
    backgroundColor: colors.white,
    display: "flex",
    flex: 1,
  },
  imageBanner: {
    width: "100%",
    height: 300,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  scrollView: {
    paddingHorizontal: 10,
    display: "flex",
    flex: 1,
  },
  replyWrapper: {
    marginBottom: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  replyInner: {
    flex: 1,
  },
  sendWrapper: {
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  closeWrapper: {
    marginBottom: 15,
  },
  closeInner: {
    width: "100%",
  },
  closeText: {
    textAlign: "center",
    fontSize: 20,
    color: colors.gray,
  },
});
