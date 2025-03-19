import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Importa o hook
import api from "../axios/axios";

export default function Login() {
  const navigation = useNavigation(); // Usa o hook para acessar a navegação

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  async function handleLogin() {
    await api.postLogin(user).then(
      (response) => {
        console.log(response.data.message);
        Alert.alert(response.data.message);
        navigation.navigate("HomeScreen"); // Navega para a tela HomeScreen
      },
      (error) => {
        console.log(error);
        Alert.alert("Erro", error.response.data.error);
      }
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={user.email}
          onChangeText={(value) => setUser({ ...user, email: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={user.password}
          onChangeText={(value) => setUser({ ...user, password: value })}
        />
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Cadastro")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Cadastrar-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderColor: "gray",
    width: "100%",
    height: 40,
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
