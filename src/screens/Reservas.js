import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import api from "../axios/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalBase from "../components/ModalBase";

export default function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [totalReservas, setTotalReservas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

  useEffect(() => {
    getUserInformation();
    getReservaCpf();
  }, []);

 

  const getUserInformation = async () => {
    try {
      const cpf = await AsyncStorage.getItem("cpf");
      getReservas(cpf);
    } catch (error) {
      console.error("Erro ao buscar as informações do usuário:", error);
    }
  };
  async function getReservaCpf() {
    try {
      const cpf = await AsyncStorage.getItem("cpf");
      const response = await api.getScheduleByCpf(cpf);
      setReservas(response.data.results);
      setTotalReservas(response.data.results[0]?.total_reservas || 0);
    } catch (error) {
      console.log("Erro ao buscar reservas", error);
    }
  }


  async function getReservas(cpf) {
    try {
      const response = await api.getScheduleByCpf(cpf);
      setReservas(response.data.results);
      setLoading(false);
    } catch (error) {
      Alert.alert(
        "Erro ao buscar reservas",
        error?.response?.data?.error || ""
      );
    }
  }

  function abrirModalSala(reserva) {
    setReservaSelecionada(reserva);
    setModalVisible(true);
  }

  function DateTreatment(data) {
    let dateTreated = data.split("T")[0];
    const [year, month, day] = dateTreated.split("-");
    return `${day}/${month}/${year}`;
  }

  async function DeleteSchedule(scheduleId) {
    try {
      const response = await api.deleteSchedule(scheduleId);
      if (response.status === 201) {
        Alert.alert("Reserva excluída com sucesso");
        setModalDeleteVisible(false);
        setModalVisible(false);
        getUserInformation(); // Atualiza a lista após deletar
        setTotalReservas(prev => prev - 1);
      }
    } catch (error) {
      Alert.alert("Erro ao excluir reserva");
      console.log(error);
    }
  }

  return (
    <View>
      <Text style={styles.title}>Minhas reservas</Text>
      <Text style={styles.total_schedules}>total: {totalReservas}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => item.id.toString()}
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

      {/* Modal com detalhes da reserva */}
      {reservaSelecionada && (
        <ModalBase open={modalVisible} onClose={() => setModalVisible(false)}>
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
              onPress={() => setModalDeleteVisible(true)}
              style={{ width: "100%" }}
            >
              <Text
                style={{
                  backgroundColor: "#D52D2D",
                  textAlign: "center",
                  color: "white",
                  padding: 10,
                  marginTop: 10,
                }}
              >
                EXCLUIR RESERVA
              </Text>
            </TouchableOpacity>
          </View>
        </ModalBase>
      )}

      {/* Modal de confirmação para deletar */}
      <ModalBase
        open={modalDeleteVisible}
        onClose={() => setModalDeleteVisible(false)}
      >
        <View>
          <Text>Deseja realmente excluir a reserva?</Text>

          <TouchableOpacity
            onPress={async () => {
              await DeleteSchedule(reservaSelecionada.id);
            }}
            style={{ marginTop: 10 }}
          >
            <Text style={{ color: "red" }}>SIM</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalDeleteVisible(false)}
            style={{ marginTop: 10 }}
          >
            <Text>NÃO</Text>
          </TouchableOpacity>
        </View>
      </ModalBase>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    textAlign: "center"
  },
  total_schedules: {
    fontSize: 17.5,
    fontWeight: "bold",
    margin: 5,
    textAlign: "center"
  },
  salaCard: {
    padding: 8,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    margin: 8,
  },
  salaName: {
    backgroundColor: "#d9d9d9",
    borderRadius: 7,
    padding: 10,
  },
});
