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

export default function Cadastro() {
  const navigation = useNavigation(); // Usa o hook para acessar a navegação

  const [user, setUser] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
    data_nascimento: "",
  });

  async function handleCadastro() {
    await api.postCadastro(user).then(
      (response) => {
        console.log(response.data.message);
        Alert.alert(response.data.message);
        navigation.navigate("HomeScreen");
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
        <Text style={styles.title}>Faça Cadastro</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={user.name}
          onChangeText={(value) => setUser({ ...user, name: value })}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={user.email}
          onChangeText={(value) => setUser({ ...user, email: value })}
        />

        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={user.cpf}
          onChangeText={(value) => setUser({ ...user, cpf: value })}
        />

        <TextInput
          style={styles.input}
          placeholder="Data de nascimento"
          value={user.data_nascimento}
          onChangeText={(value) => setUser({ ...user, data_nascimento: value })}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={user.password}
          onChangeText={(value) => setUser({ ...user, password: value })}
        />

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
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
