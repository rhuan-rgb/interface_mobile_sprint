import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Button } from "react-native";
import api from '../axios/axios'

export default function Login({navigation}){
    const [user, setUser] = useState({
        email:'',
        password:''
    })

    async function handleLogin() {
        await api.(user).then(
           (response)=>{
                console.log(response.data.message)
                Alert.alert(response.data.message)
                navigation.navigate("HomeScreen")
           },(error)=>{
                console.log( error)
                Alert.alert('Erro', error.response.data.error)
           }
           
        )
    }



    return(
        <View style={styles.container}>
        <Text style={styles.title}>Faça Login</Text>
        <TextInput style={styles.input}
        placeholder="Email"
        value={user.email}
        onChangeText={(value)=> {setUser({...user,email: value})} }/>

        <TextInput style={styles.input}
        placeholder="Senha"
        value={user.password}
        onChangeText={(value)=> {setUser({...user,password: value})}}/>

        <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text>Entrar</Text>
        </TouchableOpacity>
        <Button title='Cadastro' onPress={()=> navigation.navigate("Cadastro")}></Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title:{
        fontSize:28,
        fontWeight:'bold'
    },
    input:{
        borderColor:'gray',
        width:'100%',
        height:40,
        borderBottomWidth:1,
        marginBottom:20,
        paddingHorizontal:10
    },
    button:{
        backgroundColor:'green',
        padding:10,
        boderRadius:5
    }
})