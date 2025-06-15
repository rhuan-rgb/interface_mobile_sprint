import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import api from "../axios/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import ModalBase from "../components/ModalBase";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";


export default function Perfil() {
  const navigation = useNavigation();
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [modalSenhaVisible, setModalSenhaVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [trocarSenha, setTrocarSenha] = useState({
    senha_atual: "",
    nova_senha: "",
    show_password: false,
    show_password2: false,
  });

  useEffect(() => {
    async function getCPF() {
      try {
        const cpf = await AsyncStorage.getItem("cpf");
        if (cpf) {
          await api.getUserById(cpf).then(
            (response) => {
              let CPF_escondido = response.data.user.cpf.split("");
              for (let i = 0; i < 8; i++) {
                CPF_escondido[i] = "*";
              }
              response.data.user.cpf = CPF_escondido.join("");
              setUser(response.data.user);
            },
            (error) => {
              Alert.alert("Erro ao buscar o usuário");
              console.log(error);
            }
          );
        }
      } catch (error) {
        console.error("Erro ao carregar o perfil:", error);
      }
    }
    getCPF();
  }, []);

  async function TrocarSenha() {
    const cpf = await AsyncStorage.getItem("cpf");

    try {
      const response = await api.updatePassword({
        cpf,
        senha_atual: trocarSenha.senha_atual,
        nova_senha: trocarSenha.nova_senha,
      });

      Alert.alert(response.data.message);

      setTrocarSenha({
        senha_atual: "",
        nova_senha: "",
        show_password: false,
        show_password2: false,
      });

      setModalSenhaVisible(false);
    } catch (error) {
      console.log("Erro ao trocar senha:", error);

      // Acessa a mensagem de erro da API corretamente
      const mensagem = error?.response?.data?.error;

      Alert.alert("Erro", mensagem);
    }
  }

  async function deletarConta() {
    const cpf = await AsyncStorage.getItem("cpf");
    await api.deleteUser(cpf).then(
      () => {
        Alert.alert("conta deletada com sucesso.");
        Logout();
      },
      (error) => {
        console.log(error);
        Alert.alert("erro ao deletar a conta");
      }
    );
  }

  async function Logout() {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("cpf");
    navigation.navigate("Login");
  }

  return (
    <View style={styles.page}>
      {user ? (
        <>
          <View style={styles.container}>
            <Text style={styles.header}>Meu perfil</Text>
            <Text style={styles.info}>Nome: {user.name}</Text>
            <Text style={styles.info}>Email: {user.email}</Text>
            <Text style={styles.info}>CPF: {user.cpf}</Text>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => {
                setModalSenhaVisible(true);
              }}
              style={styles.eachButton}
            >
              <Text style={styles.buttonText}>Trocar senha</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalDeleteVisible(true);
              }}
              style={styles.eachButton}
            >
              <Text style={styles.buttonText}>Deletar conta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Logout();
              }}
              style={styles.eachButton}
            >
              <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text>Carregando perfil...</Text>
      )}

      {modalDeleteVisible && <ModalBase
        open={modalDeleteVisible}
        onClose={() => setModalDeleteVisible(!modalDeleteVisible)}
      >
        <View>
          <Text style={{ textAlign: "center", fontSize: 16 }}>
            Tem certeza de que deseja deletar esta conta?
          </Text>
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => deletarConta()}
            >
              <Text style={styles.modalButtonText}>SIM</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalDeleteVisible(!modalDeleteVisible)}
            >
              <Text style={styles.modalButtonText}>NÃO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalBase>}

      <ModalBase
        open={modalSenhaVisible}
        onClose={() => setModalSenhaVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Alterar Senha</Text>

          {/* Campo: Senha atual */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Senha atual"
              secureTextEntry={!trocarSenha.show_password}
              style={styles.input}
              value={trocarSenha.senha_atual}
              onChangeText={(text) =>
                setTrocarSenha({ ...trocarSenha, senha_atual: text })
              }
            />
            <TouchableOpacity
              onPress={() =>
                setTrocarSenha({
                  ...trocarSenha,
                  show_password: !trocarSenha.show_password,
                })
              }
            >
              <Ionicons
                name={trocarSenha.show_password ? "eye" : "eye-off"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          {/* Campo: Nova senha */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Nova senha"
              secureTextEntry={!trocarSenha.show_password2}
              style={styles.input}
              value={trocarSenha.nova_senha}
              onChangeText={(text) =>
                setTrocarSenha({ ...trocarSenha, nova_senha: text })
              }
            />
            <TouchableOpacity
              onPress={() =>
                setTrocarSenha({
                  ...trocarSenha,
                  show_password2: !trocarSenha.show_password2,
                })
              }
            >
              <Ionicons
                name={trocarSenha.show_password2 ? "eye" : "eye-off"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.modalButton} onPress={() => TrocarSenha()}>
            <Text style={styles.modalButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </ModalBase>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 20,
    justifyContent: "center", // Centraliza verticalmente
    alignItems: "center", // Centraliza horizontalmente
  },
  container: {
    alignItems: "center", // Centraliza textos e itens na view
    marginBottom: 80,
  },
  header: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  info: {
    fontSize: 24,
    marginVertical: 5,
    textAlign: "left", // Alinha o texto à esquerda
    width: 220, // Define uma largura mínima para que o texto tenha espaço para se alinhar
  },
  buttons: {
    alignItems: "center",
    justifyContent: "center",
    gap: 25,
  },
  eachButton: {
    backgroundColor: "#D90000",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // modal
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "#D90000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
  width: 200,
  height: 45,
},

  inputContainer: {
  flexDirection: "row",
  alignItems: "center",
  width: 250,
  height: 45,
  borderColor: "#ccc",
  borderWidth: 1,
  borderRadius: 8,
  paddingHorizontal: 10,
  marginBottom: 15,
  backgroundColor: "#fff",
  justifyContent: "space-between",
},

});
