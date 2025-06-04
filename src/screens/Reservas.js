import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import api from "../axios/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalBase from "../components/ModalBase";

// estava copiando do salas, pois a estilização é a mesma. Não terminei de copiar...
export default function Reservas() {
  const [cpf, setCpf] = useState(null);
  const [token, setToken] = useState("");
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getUserInformation();
  }, []);

  const getUserInformation = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const cpf = await AsyncStorage.getItem("cpf");
      if (token && cpf) {
        setToken(token);
        setCpf(cpf); // aparentemente não é necessário, mas deixei para caso falte.
        getReservas(cpf);
      }
    } catch (error) {
      console.error("Erro ao buscar as informações do usuário:", error);
    }
  };

  function abrirModalSala(reserva) {
    setReservaSelecionada(reserva);
    setModalVisible(true);
  }

  async function getReservas(cpf) {
    try {
      const response = await api.getScheduleByCpf(cpf);
      setReservas(response.data.results);
      
    } catch (error) {
      console.log("Erro: ", error.response.data.error);
    } finally {
        setLoading(false);
    }
  }

  return (
    <View>
      <Text>Minhas reservas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => item.id.toString()} // o quê vai ser o id de cada elemento da lista?
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.salaCard}
              onPress={() => abrirModalSala(item)}
            >
              <View style={styles.salaName}>
                <Text style={{ fontWeight: "bold" }}>
                  Sala: {item.classroom.toString()}
                </Text>
                <Text>Data de início: {DateTreatment(item.dateStart)}</Text>
                <Text>Data de término: {DateTreatment(item.dateEnd)}</Text>
                <Text>
                  Horário: {item.timeStart} - {item.timeEnd}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      <ModalBase
        open={modalVisible}
        onClose={() => setModalVisible(!modalVisible)}
      >
        <View>
          <Text style={{ fontWeight: "bold" }}>
            Sala: {reservaSelecionada.classroom}
          </Text>
          <Text>
            Data de início: {DateTreatment(reservaSelecionada.dateStart)}
          </Text>
          <Text>
            Data de término: {DateTreatment(reservaSelecionada.dateEnd)}
          </Text>
          <Text>
            Horário: {reservaSelecionada.timeStart} -{" "}
            {reservaSelecionada.timeEnd}
          </Text>
          <Text>Dias reservados: {reservaSelecionada.days}</Text>
          <TouchableOpacity
            onPress={() => DeleteSchedule(reservaSelecionada)}
            style={{ width: "100%" }}
          >
            <Text style={{ backgroundColor: "#D52D2D", alignItems: "center" }}>
              EXCLUIR RESERVA
            </Text>
          </TouchableOpacity>
        </View>
      </ModalBase>
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
});

function DateTreatment(data) {
  let dateTreated = data.split("T")[0];
  const [year, month, day] = dateTreated.split("-");
  return `${day}/${month}/${year}`;
}

function DeleteSchedule(schedule) {
  api.deleteSchedule(schedule);
}
