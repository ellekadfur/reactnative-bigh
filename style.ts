import { Dimensions, StyleSheet } from "react-native";
const widthScreen = Dimensions.get("screen").width;
const styles = StyleSheet.create({
  textStyle: {
    paddingTop: 50,
    textAlign: "center",
    color: "red",
  },
  header: {
    backgroundColor: "#18c3e5",
    width: "100%",
    height: 56,
    justifyContent: "center",
    alignContent: "center",
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "left",
  },
  container: {
    flexDirection: "column",
    padding: 20,
  },
  textInput:{
    padding:10
  }
});

export default styles;
