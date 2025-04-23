import React from "react";
import { Text, View, StyleSheet} from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.quadrado_cinza}></View>
      <View style={styles.quadrado_teste}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 50,
    marginBottom: 70,
  },
  teste: {
    padding: 0,
    backgroundColor: "purple",
  },
  quadrado_cinza: {
    height: 75,
    width: 75,
    backgroundColor: "#D9D9D9",
    borderRadius: "5px",
  },
  quadrado_teste: {
    height: 75,
    width: 75,
    backgroundColor: "yellow",
    borderRadius: "5px",
  },
});
