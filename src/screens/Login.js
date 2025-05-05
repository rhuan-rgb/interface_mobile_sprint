import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../axios/axios";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const navigation = useNavigation();

  const [user, setUser] = useState({
    cpf: 0,
    password: "",
    showPassword: true,
  });

  async function guardarCpf(cpfUser) {
    try {
      
      await AsyncStorage.setItem("cpf", cpfUser);
    } catch (erro) {
      console.error("Erro ao armazenar dados:", erro);
    }
  }

  async function handleLogin() {
    await api.postLogin(user).then(
      async (response) => {
        console.log(response.data.message);
        Alert.alert(response.data.message);
        navigation.navigate("HomeScreen"); // Navega para a tela HomeScreen

        const cpfUser = response.data.user.cpf;

        guardarCpf(cpfUser);
        console.log("-----cpf------: ", await AsyncStorage.getItem("cpf"))
      },
      (error) => {
        console.log(error);
        Alert.alert("Erro", error.response.data.error);
      }
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../images/senai-logo.png")}
        style={styles.image}
      />
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="CPF"
            value={user.cpf}
            onChangeText={(value) => setUser({ ...user, cpf: value })}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry={user.showPassword}
            value={user.password}
            onChangeText={(value) => setUser({ ...user, password: value })}
          />
          <TouchableOpacity
            onPress={() =>
              setUser({ ...user, showPassword: !user.showPassword })
            }
          >
            <Ionicons
              name={user.showPassword ? "eye-off" : "eye"}
              size={34}
              color="gray"
            />
          </TouchableOpacity>
        </View>

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
    padding: 20,
  },
  input: {
    width: "100%",
    height: 40,
    margin: 4,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#E31313",
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingRight: 50,
    backgroundColor: "#D9D9D9",
    marginTop: 8,
    borderRadius: 5,
  },
  image: {
    width: 207,
    height: 53,
  },
});
