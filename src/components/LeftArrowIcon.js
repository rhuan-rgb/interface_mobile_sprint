import React from "react";
import {View, StyleSheet} from "react-native";
import EvilIcons from '@expo/vector-icons/EvilIcons';

export default function LeftArrowIcon(){
    return (
        <View style={styles.icon}>
            <EvilIcons name="arrow-left" size={24} color="black" />
        </View>
    )
}

const styles = StyleSheet.create({
    icon:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        // height: '24px',
        width: '100%',
        backgroundColor:'green',
    },
})