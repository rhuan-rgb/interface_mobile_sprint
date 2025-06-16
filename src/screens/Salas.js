import React, { useEffect, useState, useRef } from "react";
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
import { ScrollView, TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Importa o hook
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Checkbox from 'expo-checkbox';
import DatePicker from "../components/DatePicker";

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
  // useRef para impedir que o daysArray seja resetado a cada renderização
  const daysArray = useRef([]);
  const [salasDisponiveisList, setSalasDisponiveis] = useState(false);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");


  const [isChecked, setChecked] = useState({
    Seg: false,
    Ter: false,
    Qua: false,
    Qui: false,
    Sex: false,
    Sab: false
  });

  const [cpf, setCpf] = useState("");
  const [token, setToken] = useState("");




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
    if (!scheduleSelecionada.dateStart || !scheduleSelecionada.dateEnd || !scheduleSelecionada.days) {
      alert("Informe o período e os dias dos agendamentos.");
      return;
    }

    try {
      if (data_nao_valida(scheduleSelecionada.dateStart, scheduleSelecionada.dateEnd)) {
        alert("Data do agendamento inválida");
        return;
      }

      const salas = await api.getSchedulesByIdClassroomRanges(
        salaSelecionada.number,
        scheduleSelecionada.dateStart,
        scheduleSelecionada.dateEnd
      );

      const salasFiltradas = limparHorariosComAgendamentos(
        salas.data.schedulesByDayAndTimeRange
      );

      // alert(JSON.stringify(salasFiltradas));
      setSalasDisponiveis(salasFiltradas);
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
        days: scheduleSelecionada.days.split(",").map((dia) => dia.trim()),
        timeStart: scheduleSelecionada.timeStart,
        timeEnd: scheduleSelecionada.timeEnd,
        classroom: salaSelecionada.number,
        user: cpf,
      };
      console.log(sala);

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
      setSalasDisponiveis(false);
      setHorarioSelecionado("");
      setChecked({
        Seg: false,
        Ter: false,
        Qua: false,
        Qui: false,
        Sex: false,
        Sab: false
      });

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

  function daysFunction(number, willBeChecked) {
    const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    const dia = dias[number];

    if (willBeChecked) {
      if (!daysArray.current.includes(dia)) {
        daysArray.current.push(dia);
      }
    } else {
      daysArray.current = daysArray.current.filter((day) => day !== dia);
    }

    // atualiza o texto do campo "Dias"
    setScheduleSelecionada((prev) => ({
      ...prev,
      days: daysArray.current.join(", "),
    }));
  }

  function formatarDataParaBR(dataISO) {
    if (!dataISO || typeof dataISO !== "string") return "";

    const partes = dataISO.split("-");
    if (partes.length !== 3) return "";

    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
  }


  function formatarHora(intervalo) {
    if (!intervalo) return;

    const [ini, fim] = intervalo.split("-").map((s) => s.trim());

    setScheduleSelecionada((prev) => ({
      ...prev,
      timeStart: ini,
      timeEnd: fim,
    }));

    setHorarioSelecionado(intervalo);
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
        onRequestClose={() => { setModalVisible(false); setSalaSelecionada(false) }}
        animationType="slide"
      >
        <ScrollView>
          <View style={styles.modalContainer}>
            <Text style={{ alignSelf: "center" }}>Preencha os campos da sua reserva</Text>
            <View style={styles.risco}></View>
            <Text style={{ fontSize: 20, marginTop: "10%" }}>
              {salaSelecionada.number} - {salaSelecionada.description}
            </Text>

            <Text>Data de início</Text>
            <DatePicker
              type="date"
              buttonTitle={
                scheduleSelecionada.dateStart === ""
                  ? "Selecione a data inicial da reserva"
                  : formatarDataParaBR(scheduleSelecionada.dateStart)   // já vem em YYYY-MM-DD
              }
              dateKey="dateStart"
              setValue={setScheduleSelecionada}
            />

            <Text>Data de término</Text>
            <DatePicker
              type="date"
              buttonTitle={
                scheduleSelecionada.dateEnd === ""
                  ? "Selecione a data final da reserva"
                  : formatarDataParaBR(scheduleSelecionada.dateEnd)   // já vem em YYYY-MM-DD
              }
              dateKey="dateEnd"
              setValue={setScheduleSelecionada}
            />

            <Text style={{ marginBottom: 10 }}>Dias da semana</Text>

            {/* Seg */}
            <View style={styles.checkbox_section}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked.Seg}
                onValueChange={() => {
                  const novoValor = !isChecked.Seg;
                  setChecked((prev) => ({ ...prev, Seg: !prev.Seg }));
                  daysFunction(0, novoValor);
                }}
              />
              <Text style={styles.paragraph}>Seg</Text>
            </View>

            {/* Ter */}
            <View style={styles.checkbox_section}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked.Ter}
                onValueChange={() => {
                  const novoValor = !isChecked.Ter;
                  setChecked((prev) => ({ ...prev, Ter: !prev.Ter }));
                  daysFunction(1, novoValor);
                }}
              />
              <Text style={styles.paragraph}>Ter</Text>
            </View>

            {/* Qua */}
            <View style={styles.checkbox_section}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked.Qua}
                onValueChange={() => {
                  const novoValor = !isChecked.Qua;
                  setChecked((prev) => ({ ...prev, Qua: !prev.Qua }));
                  daysFunction(2, novoValor);
                }}
              />
              <Text style={styles.paragraph}>Qua</Text>
            </View>

            {/* Qui */}
            <View style={styles.checkbox_section}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked.Qui}
                onValueChange={() => {
                  const novoValor = !isChecked.Qui;
                  setChecked((prev) => ({ ...prev, Qui: !prev.Qui }));
                  daysFunction(3, novoValor);
                }}
              />
              <Text style={styles.paragraph}>Qui</Text>
            </View>

            {/* Sex */}
            <View style={styles.checkbox_section}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked.Sex}
                onValueChange={() => {
                  const novoValor = !isChecked.Sex;
                  setChecked((prev) => ({ ...prev, Sex: !prev.Sex }));
                  daysFunction(4, novoValor);
                }}
              />
              <Text style={styles.paragraph}>Sex</Text>
            </View>

            {/* Sab */}
            <View style={styles.checkbox_section}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked.Sab}
                onValueChange={() => {
                  const novoValor = !isChecked.Sab;
                  setChecked((prev) => ({ ...prev, Sab: !prev.Sab }));
                  daysFunction(5, novoValor);
                }}
              />
              <Text style={styles.paragraph}>Sab</Text>
            </View>


            {salasDisponiveisList && (
              <View style={{ marginTop: 20 }}>
                {scheduleSelecionada.days
                  .split(",")
                  .map((dia) => dia.trim())
                  .filter((dia) => salasDisponiveisList[dia])
                  .map((dia) => (
                    <View key={dia} style={{ marginBottom: 20 }}>
                      <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 6 }}>
                        {dia}
                      </Text>
                      <View style={{ backgroundColor: "#f0f0f0", borderRadius: 6, padding: 10 }}>
                        {(() => {
                          const horariosUnicos = new Set();
                          Object.values(salasDisponiveisList).forEach((horarios) => {
                            Object.keys(horarios).forEach((hora) => horariosUnicos.add(hora));
                          });
                          const horariosOrdenados = Array.from(horariosUnicos).sort();

                          return horariosOrdenados.map((horario) => {
                            const ativo = horarioSelecionado === horario;

                            return (
                              <TouchableOpacity
                                key={`${dia}-${horario}`}
                                onPress={() => formatarHora(horario)}
                                style={[
                                  styles.horarioBtn,
                                  ativo ? styles.horarioAtivo : styles.horarioInativo,
                                ]}
                                disabled={salasDisponiveisList[dia][horario] === undefined}
                              >
                                <Text
                                  style={ativo ? styles.horarioTextoAtivo : styles.horarioTextoInativo}
                                >
                                  {salasDisponiveisList[dia][horario] !== undefined
                                    ? horario
                                    : "Indisponível"}
                                </Text>
                              </TouchableOpacity>
                            );
                          });
                        })()}
                      </View>
                    </View>
                  ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.buttonDisponivel}
              onPress={() =>
                handleDisponibilidade(
                  salaSelecionada.number,
                  scheduleSelecionada.dateStart,
                  scheduleSelecionada.dateEnd
                )
              }
            >
              <Text style={{ color: "white" }}>
                Conferir disponibilidade das salas
              </Text>
            </TouchableOpacity>





            <TouchableOpacity style={styles.closeButton} onPress={criarReserva}>
              <Text style={{ color: "white" }}>Reservar</Text>
            </TouchableOpacity>

            <View style={styles.iconCloseContainer}>
              <EvilIcons
                name="close"
                size={28}
                color="black"
                onPress={() => setModalVisible(false)}
              />
            </View>

          </View>
        </ScrollView>

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
    marginTop: 10, // Reduzindo a margem superior
    backgroundColor: "#D52D2D",
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
    borderRadius: 6,
    color: "white",
    width: 120,
    height: 40,
    fontSize: 18,
    alignSelf: "center",
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
  iconCloseContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },

  buttonDisponivel: {
    marginTop: 10,
    backgroundColor: "#D52D2D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    borderRadius: 6,
    width: 300,
    alignSelf: "center",
  },
  checkbox_section: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    marginRight: 8,
  },
  paragraph: {
    fontSize: 16,
  },
  horarioBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  horarioAtivo: {
    backgroundColor: "#0077bb", // vermelho quando clicado
  },
  horarioInativo: {
    backgroundColor: "#f0f0f0", // cor neutra
  },
  horarioTextoAtivo: {
    color: "#fff",
    fontWeight: "bold",
  },
  horarioTextoInativo: {
    color: "#000",
  },

});
