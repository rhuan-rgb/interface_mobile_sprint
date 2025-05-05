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
  Alert,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Importa o hook
import EvilIcons from '@expo/vector-icons/EvilIcons';

export default function Salas() {
  const navigation = useNavigation();
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salaSelecionada, setSalaSelecionada] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [scheduleSelecionada, setScheduleSelecionada] = useState({
    dateStart: "",
    dateEnd: "",
    days: "",
    timeStart: "",
    timeEnd: "",
  });

  const [cpf, setCpf] = useState("");
  const [token, setToken] = useState("");

  const [selectedRoom, setSelectedRoom] = useState("");
  const [dataReservaInicio, setdataReservaInicio] = useState("");
  const [dataReservaTermino, setdataReservaTermino] = useState("");

  const data_nao_valida = (dataInicio, dataTermino) => {
    const d1Epoch = getEpochLocal(dataInicio);
    const d2Epoch = getEpochLocal(dataTermino);
    const nowEpoch = new Date().setHours(0, 0, 0, 0);

    if (d2Epoch < d1Epoch || d1Epoch < nowEpoch || d2Epoch < nowEpoch) {
      return true;
    }

    return false;
  };

  const getEpochLocal = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day).setHours(0, 0, 0, 0);
  };

  const handleDisponibilidade = async () => {
    if (!dataReservaInicio || !dataReservaTermino) {
      alert("Informe o período dos agendamentos.");
      return;
    }

    try {
      if (data_nao_valida(dataReservaInicio, dataReservaTermino)) {
        alert("Data do agendamento inválida");
        return;
      }

      const salas = await api.getSchedulesByIdClassroomRanges(
        selectedRoom,
        dataReservaInicio,
        dataReservaTermino
      );

      const salasFiltradas = limparHorariosComAgendamentos(
        salas.data.schedulesByDayAndTimeRange
      );

      alert(JSON.stringify(salasFiltradas));
    } catch (error) {
      console.error("Erro ao buscar horários:", error);
      alert("Erro ao buscar horários.");
    }
  };

  const limparHorariosComAgendamentos = (schedulesByDayAndTimeRange) => {
    const diasDaSemana = Object.keys(schedulesByDayAndTimeRange);

    return diasDaSemana.reduce((acc, dia) => {
      const horariosFiltrados = Object.entries(schedulesByDayAndTimeRange[dia])
        .filter(([intervalo, reservas]) => reservas.length === 0)
        .reduce((obj, [intervalo]) => {
          obj[intervalo] = [];
          return obj;
        }, {});

      if (Object.keys(horariosFiltrados).length > 0) {
        acc[dia] = horariosFiltrados;
      }
      return acc;
    }, {});
  };

  async function criarReserva() {
    if (!cpf) {
      Alert.alert("Erro", "O CPF do usuário não foi carregado.");
      return;
    }
    try {
      console.log(salaSelecionada.number);
      console.log("In Criar Reserva: ", cpf);

      const sala = {
        dateStart: scheduleSelecionada.dateStart,
        dateEnd: scheduleSelecionada.dateEnd,
        days: scheduleSelecionada.days.split(","),
        timeStart: scheduleSelecionada.timeStart,
        timeEnd: scheduleSelecionada.timeEnd,
        classroom: salaSelecionada.number,
        user: cpf,
      };

      const response = await api.postSchedule(sala);
      Alert.alert(response.data.message);

      setScheduleSelecionada({
        dateStart: "",
        dateEnd: "",
        days: "",
        timeStart: "",
        timeEnd: "",
      });
      setModalVisible(false);
    } catch (error) {
      console.log("Erro ao criar agendamento", error);
      Alert.alert(error.response.data.error);
    }
  }

  async function abrirModalSala(sala) {
    setSalaSelecionada(sala);
    setModalVisible(true);
  }

  const getCpf = async () => {
    try {
      const cpf = await AsyncStorage.getItem("cpf");

      if (cpf) {
        setCpf(cpf);
      }
    } catch (error) {
      console.error("Erro ao buscar cpf:", error);
    }
  };

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setToken(token);
      }
    } catch (error) {
      console.error("Erro ao buscar token:", error);
    }
  };

  useEffect(() => {
    getToken();
    getCpf();
    getSalas();
  }, []);

  async function getSalas() {
    try {
      const response = await api.getAllClassrooms();
      console.log(response.data);
      setSalas(response.data.classrooms);
      setLoading(false);
    } catch (error) {
      console.log("Erro: ", error.response.data.error);
    }
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
              onPress={() => abrirModalSala(item)}
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
          <Text style={{ left: "25%" }}>Preencha os campos da sua reserva</Text>
          <View style={styles.risco}></View>
          <Text style={{ fontSize: 20, marginTop: "10%" }}>
            {salaSelecionada.number} - {salaSelecionada.description}
          </Text>

          <Text style={{ marginTop: "30" }}>Data de início</Text>
          <TextInput
            value={scheduleSelecionada.dateStart}
            onChangeText={(text) =>
              setScheduleSelecionada({
                ...scheduleSelecionada,
                dateStart: text,
              })
            }
            style={styles.input}
            placeholder="yyyy-mm-dd"
          />

          <Text>Data de término</Text>
          <TextInput
            value={scheduleSelecionada.dateEnd}
            onChangeText={(text) =>
              setScheduleSelecionada({
                ...scheduleSelecionada,
                dateEnd: text,
              })
            }
            style={styles.input}
            placeholder="yyyy-mm-dd"
          />

          <Text>Dias</Text>
          <TextInput
            value={scheduleSelecionada.days}
            onChangeText={(text) =>
              setScheduleSelecionada({
                ...scheduleSelecionada,
                days: text,
              })
            }
            style={styles.input}
            placeholder="Ex: Seg, Ter, Qua"
          />

          <Text>Horário de início</Text>
          <TextInput
            value={scheduleSelecionada.timeStart}
            onChangeText={(text) =>
              setScheduleSelecionada({
                ...scheduleSelecionada,
                timeStart: text,
              })
            }
            style={styles.input}
            placeholder="Ex: 10:00"
          />

          <Text>Horário de término</Text>
          <TextInput
            value={scheduleSelecionada.timeEnd}
            onChangeText={(text) =>
              setScheduleSelecionada({
                ...scheduleSelecionada,
                timeEnd: text,
              })
            }
            style={styles.input}
            placeholder="Ex: 11:00"
          />

          <TouchableOpacity style={styles.closeButton} onPress={criarReserva}>
            <Text style={{ color: "white" }}>Reservar</Text>
          </TouchableOpacity>

          <Text style={{ marginTop: 10 }}>
            Deseja consultar a disponibildade?
          </Text>

          <Text style={{ marginTop: 10 }}>Sala Selecionada</Text>
          <TextInput
            style={styles.input}
            placeholder="Número da sala"
            value={selectedRoom}
            onChangeText={setSelectedRoom}
          />
          <Text>Data de Início</Text>
          <TextInput
            style={styles.input}
            placeholder="dd-mm-yyyy"
            value={dataReservaInicio}
            onChangeText={setdataReservaInicio}
          />
          <Text>Data de Término</Text>
          <TextInput
            style={styles.input}
            placeholder="dd-mm-yyyy"
            value={dataReservaTermino}
            onChangeText={setdataReservaTermino}
          />

          <TouchableOpacity
            style={styles.botao}
            onPress={() =>
              handleDisponibilidade(
                selectedRoom,
                dataReservaInicio,
                dataReservaTermino
              )
            }
          >
          </TouchableOpacity>

          <EvilIcons name="close" size={24} color="black" onPress={() => setModalVisible(false)} />
          

        </View>
      </Modal>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          navigation.navigate("HorariosDisponiveis");
        }}
      >
        <Text style={{ color: "white" }}>Horarios Disponiveis</Text>
      </TouchableOpacity>
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
    marginTop: 10, // Reduzindo a margem superior
    backgroundColor: "#D52D2D",
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
    borderRadius: 6,
    color: "white",
    width: 120,
    height: 40,
    fontSize: 18, // Menor tamanho de fonte
    left: "37%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  risco: {
    backgroundColor: "#D52D2D",
    width: "95%",
    height: 1,
    margin: 10,
  },
});
