import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  loginFormContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
  },

  formContainer: {
    width: 400,
    height: 300,
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 1,
    display: "flex",
    justifyContent: "space-around",
    padding: 25,
  },

  textInputStyling: {
    borderWidth: 1,
    borderColor: "black",
  },

  submitButton: {
    backgroundColor: "#276CF5",
    borderRadius: 1,
    width: 100,
    alignSelf: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 30,
    borderRadius: 5,
  },

  submitButtonText: {
    color: "white",
  },

  errorMessage: {
    color: "red",
  },
});

export default styles;
