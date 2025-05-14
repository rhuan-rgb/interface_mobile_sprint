import React, { useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";
// import { useNavigation } from "@react-navigation/native";
import api from "../axios/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function getCPF(){
    const cpf = await AsyncStorage.getItem("cpf");
}

useEffect (()=>{
    getCPF();
})


export default function Perfil() {
  let user = api.getUserById(cpf);
  // const navigation = useNavigation();

  user.cpf = user.cpf.split("");
  for (const i = 0; i === 6; i++) {
    user.cpf[i] = "*";
  }
  user.cpf = user.cpf.join("");

  return (
    <View>
      <Text style={{ fontSize: 24 }}>Meu perfil</Text>
      <Text>Nome: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Text>CPF: {user.cpf}</Text>
    </View>
  );
}
