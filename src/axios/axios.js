import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: "http://10.89.240.90:5000/api/reservas/v1/",
  headers: {
    accept: "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const sheets = {
  // início
  postLogin: (user) => api.post("user/login", user),
  postCadastro: (user) => api.post("user", user),

  //perfil
  getUserById: (cpf) => api.get(`user/${cpf}`),
  updatePassword: (trocarSenha) => api.put(`/user/newpassword`, trocarSenha),
  deleteUser: (cpf) => api.delete(`/user/${cpf}`, cpf),

  //salas (reservar as salas)
  getAllClassrooms: () => api.get("classroom"),
  postSchedule: (sala) => api.post("schedule", sala),
  getSchedulesByIdClassroomRanges: (class_id, dataInicio, dataTermino) =>
    api.get(
      `/schedule/ranges/${class_id}?weekStart=${dataInicio}&weekEnd=${dataTermino}`
    ),

  //reservas
  getScheduleByCpf: (cpf) => api.get(`schedule/cpf/${cpf}`),
  deleteSchedule: (schedule) => api.delete(`schedule/${schedule}`),
};

export default sheets;
