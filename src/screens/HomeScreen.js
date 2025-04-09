import React from "react";
import {Text, View, StyleSheet} from "react-native";
import LeftArrowIcon from "../components/LeftArrowIcon";

export default function HomeScreen() {
    return (
        <View>
            <LeftArrowIcon/>
            <Text style={styles.teste}>HomeScreen bruh</Text>
        </View>
        
    )
}

const styles = StyleSheet.create({
    teste:{
        padding:"800px",
        backgroundColor:"purple",
    }
})
