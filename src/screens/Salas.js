import { use, useEffect, useState } from "react";
import api from "../axios/axios";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

export default function Salas() {
  const [salas, setSalas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [salaSelecionada, setSalaSelecionada] = useState("");

  useEffect(() => {
    getSalas();
  }, []);

  async function getSalas() {
    try {
      const response = await api.getAllClassrooms();
      console.log(response.data);
      setSalas(response.data.classrooms);
      setLoading(false);
    } catch (error) {
      console.log(error.response.data.error);
    }
  }

  async function abrirModalReserva(sala) {
    setSalaSelecionada(sala);
    setModalVisible(true);
    await api.postSchedule(sala).then(
        (response) => {
          console.log(response.data.message);
          Alert.alert(response.data.message);
        },
        (error) => {
          console.log(error);
          Alert.alert("Erro", error.response.data.error);
        }
      );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Salas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
        <FlatList
          data={salas}
          keyExtractor={(item) => item.number.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.salaCard}
              onPress={() => abrirModalReserva(item)}
            >
              <View style={styles.salaName}>
                <Text style={{ fontWeight: "bold" }}>{item.number}</Text>
                <Text>Descrição: {item.description}</Text>
                <Text>Capacidade: {item.capacity}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Text>{salaSelecionada.description}</Text>
           
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: "white" }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#807F7F",
  },
  salaCard: {
    padding: 8,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
  },
  salaName: {
    backgroundColor: "#d9d9d9",
    borderRadius: 7,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  ingressoItem: {
    padding: 10,
    backgroundColor: "#e6e6e6",
    marginBottom: 10,
    borderRadius: 6,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "blue",
    padding: 10,
    alignItems: "center",
    borderRadius: 6,
  },
});
