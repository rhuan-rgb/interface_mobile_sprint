import React from "react";
import { Text, View, StyleSheet, Touchable, TouchableOpacity } from "react-native";

// estava copiando do salas, pois a estilização é a mesma. Não terminei de copiar...
export default function Reservas() {

    const navigation = useNavigation();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [salaSelecionada, setSalaSelecionada] = useState("");
    const [modalVisible, setModalVisible] = useState(false);


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
        <View>
            <Text>Minhas reservas</Text>
            {loading ? (
                <ActivityIndicator size="large" color="red" />
            ) : (
                <FlatList
                    data={reservas}
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
        </View>
    )
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
})