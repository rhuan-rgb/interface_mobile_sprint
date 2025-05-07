import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import Login from "./screens/Login";
import Cadastro from "./screens/Cadastro";
import HomeScreen from "./screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Layout from "./components/MyLayout";
import Perfil from "./screens/Perfil";
import Salas from "./screens/Salas";
import Reservas from "./screens/Reservas";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        <Stack.Screen
          name="Login"
          component={() => (
            <Layout showLeftArrowIcon={false} showAccountCircleIcon={false}>
              <Login />
            </Layout>
          )}
        />
        <Stack.Screen
          name="HomeScreen"
          component={() => (
            <Layout showLeftArrowIcon={false}>
              <HomeScreen />
            </Layout>
          )}
        />
        <Stack.Screen
          name="Cadastro"
          component={() => (
            <Layout showLeftArrowIcon={false} showAccountCircleIcon={false}>
              <Cadastro />
            </Layout>
          )}
        />
        <Stack.Screen
          name="Perfil"
          component={() => (
            <Layout showAccountCircleIcon={false}>
              <Perfil />
            </Layout>
          )}
        />
        <Stack.Screen
          name="Reservas"
          component={() => (
            <Layout>
              <Reservas />
            </Layout>
          )}
        />

        <Stack.Screen
          name="Salas"
          component={() => (
            <Layout>
              <Salas />
            </Layout>
          )}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
}
