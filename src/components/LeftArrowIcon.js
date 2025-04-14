import React from "react";
import {View, StyleSheet, TouchableOpacity} from "react-native";
import EvilIcons from '@expo/vector-icons/EvilIcons';

export default function LeftArrowIcon(){
    return (
        <View style={styles.icon}>
            <TouchableOpacity>
                <EvilIcons name="arrow-left" size={40} color="black" />
            </TouchableOpacity>
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