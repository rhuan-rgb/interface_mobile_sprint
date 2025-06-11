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
import { useNavigation } from "@react-navigation/native"; // Importa o hook
import api from "../axios/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Cadastro() {
  const navigation = useNavigation(); // Usa o hook para acessar a navegação

  const [user, setUser] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
  });

  async function handleCadastro() {
    await api.postCadastro(user).then(
      (response) => {
        console.log(response.data.message);
        Alert.alert(response.data.message);
        guardarCpfToken(user);
        navigation.navigate("HomeScreen");
      },
      (error) => {
        console.log(error);
        Alert.alert("Erro", error.response.data.error);
      }
    );
  }

  async function guardarCpfToken(user) {
    try {
      await api.postLogin(user).then(
        async (response) => {
          const token = response.data.token;
          console.log(token);
          console.log("antes do setItem token")
          await AsyncStorage.setItem("token", token);
        },
        (error) => {
          console.log(error);
          console.log("caiu no error");
          Alert.alert("Erro", error.response.data.error);
        }
      );
      await AsyncStorage.setItem("cpf", user.cpf);
    } catch (erro) {
      console.error("Erro ao armazenar dados:", erro);
    }
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
            placeholder="Nome"
            value={user.name}
            onChangeText={(value) => setUser({ ...user, name: value })}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={user.email}
            onChangeText={(value) => setUser({ ...user, email: value })}
          />
        </View>

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
            secureTextEntry
            value={user.password}
            onChangeText={(value) => setUser({ ...user, password: value })}
          />
        </View>

        <TouchableOpacity onPress={handleCadastro} style={styles.button}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Já tem conta? Faça Login</Text>
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
