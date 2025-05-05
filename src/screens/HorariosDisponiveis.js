import React, { useEffect, useState } from "react";
import api from "../axios/axios";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { TouchableOpacity } from "react-native";

export default function HorariosDisponiveis() {


  const data_nao_valida = (dataInicio, dataTermino) => {
    const d1Epoch = getEpochLocal(dataInicio);
    const d2Epoch = getEpochLocal(dataTermino);
    const nowEpoch = new Date().setHours(0, 0, 0, 0);

    if (d2Epoch < d1Epoch || d1Epoch < nowEpoch || d2Epoch < nowEpoch) {
      return true;
    }

    return false;
  }

  const getEpochLocal = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
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

  return (
    <View style={styles.container}>
      <Text>Sala Selecionada</Text>
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
        <Text style={styles.botaoTexto}>
          Conferir disponibilidade das salas
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },

  botao: {
    backgroundColor: "#D52D2D",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  botaoTexto: {
    color: "white",
    fontWeight: "bold",
  },
});
