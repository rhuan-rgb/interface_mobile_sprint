import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import Login from "./screens/Login";
import Cadastro from "./screens/Cadastro";
import HomeScreen from "./screens/HomeScreen"
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Layout from "./components/MyLayout";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="HomeScreen">
        <Stack.Screen
          name="Login"
          component={() => (
            <Layout>
              <Login />
            </Layout>
          )}
        />
        <Stack.Screen
          name="HomeScreen"
          component={() => (
            <Layout>
              <HomeScreen />
            </Layout>
          )}
        />
        <Stack.Screen
          name="Cadastro"
          component={() => (
            <Layout>
              <Cadastro />
            </Layout>
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
