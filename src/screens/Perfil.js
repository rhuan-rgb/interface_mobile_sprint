import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import api from "../axios/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Perfil() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getCPF() {
      try {
        const cpf = await AsyncStorage.getItem("cpf");
        if (cpf) {
          await api.getUserById(cpf).then(
            (response) =>{
              let CPF_escondido = response.data.user.cpf.split("");
              for (let i = 0; i < 8; i++) {
                CPF_escondido[i] = "*";
              }
              response.data.user.cpf = CPF_escondido.join("");
              setUser(response.data.user);
            }, (error) => {
              Alert.alert("erro ao buscar o usuário");
            }
          )
        }
      } catch (error) {
        console.error("Erro ao carregar o perfil:", error);
      }
    }
    getCPF();
  }, []);

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.header}>Meu perfil</Text>
          <Text style={styles.info}>Nome: {user.name}</Text>
          <Text style={styles.info}>Email: {user.email}</Text>
          <Text style={styles.info}>CPF: {user.cpf}</Text>
          
        </>
      ) : (
        <Text>Carregando perfil...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 20,
    width: '100%',
  },
  header: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
  },
  info: {
    fontSize: 36,
    marginVertical: 5,
  },
});







