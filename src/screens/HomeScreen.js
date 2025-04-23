import React from "react";
import { Text, View, StyleSheet, Touchable, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native"; // Importa o hook


export default function HomeScreen() {

  const navigation = useNavigation(); 

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=> navigation.navigate("Salas")} style={styles.quadrado_cinza}>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="google-classroom"
            size={100}
            color="black"
            style={{margintTop: 5}}
          />
          <Text style={{ fontSize: 20, marginBottom: 20 }}>Salas</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=> navigation.navigate("Reservas")} style={styles.quadrado_cinza}>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome6 name="user" size={80} color="black" style={{margin: 10}} />
          <Text style={{ fontSize: 20, }}>Salas</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    marginBottom: 70,
  },
  teste: {
    padding: 0,
    backgroundColor: "purple",
  },
  quadrado_cinza: {
    height: 150,
    width: 150,
    backgroundColor: "#D9D9D9",
    borderRadius: 15,
  },
});
