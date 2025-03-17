import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import Login from "./screens/LoginScreen";
import Cadastro from "./screens/CadastroScreen";
import {NavigationContainer} from "@react-navigation/native"
import {createStackNavigator} from "@react-navigation/stack"
import CadastroEvento from "./screens/CadastroEventoScreen"
import CadastroIngresso from "./screens/CadastroIngressoScreen"
import CadastroOrganizador from "./screens/CadastroOrganizadorScreen"
import HomeScreen from "./screens/HomeScreen"


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        {/* <Stack.Screen name="" component={}/> */}
        

      </Stack.Navigator>

    </NavigationContainer>
  )
}


