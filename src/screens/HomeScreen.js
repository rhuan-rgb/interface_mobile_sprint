import React from "react";
import {Text, View, StyleSheet} from "react-native";


export default function HomeScreen() {
    return (
        <View>
            <Text style={styles.teste}>HomeScreen bruh</Text>
            <Text style={styles.teste}>HomeScreen bruh</Text>
            <Text style={styles.teste}>HomeScreen bruh</Text>
            <Text style={styles.teste}>HomeScreen bruh</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    teste:{
        padding:0,
        backgroundColor:"purple",
    }
})
