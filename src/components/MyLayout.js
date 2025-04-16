import React from "react";
import {
  View,
  StyleSheet,
  Image,
} from "react-native";
import { LeftArrowIcon, AccountCircleIcon, } from "./topIcons";

export default function MyLayout({
  children,
  showLeftArrowIcon = true,
  showAccountCircleIcon = true,
}) {
  return (
    <View style={{ flex: 1 }}>
      {/* Cabeçalho */}
      <View style={styles.header_red} />
      <View style={styles.header_grey}>
        <Image
          source={require("../images/senai-logo.png")}
          style={styles.senai_logo}
        />
      </View>
      <View style={styles.header_minired} />
      {/* Ícones */}
      <View style={styles.icon}>
        {showAccountCircleIcon && <AccountCircleIcon />}
        {showLeftArrowIcon && <LeftArrowIcon />}
      </View>

      {/* Conteúdo centralizado */}
      <View style={styles.container}>{children}</View>

      {/* Rodapé */}
      <View style={styles.footer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Faz com que essa view ocupe o maior espaço possível
    justifyContent: "center", // Centraliza verticalmente
    alignItems: "center", // Centraliza horizontalmente
    paddingHorizontal: 20, // Adiciona espaçamento lateral
  },
  header_grey: {
    backgroundColor: "#D9D9D9",
    width: "100%",
    height: 80,
    paddingLeft: 20,
    justifyContent: "center",
  },
  header_red: {
    backgroundColor: "#D52D2D",
    width: "100%",
    height: 40,
  },
  header_minired: {
    backgroundColor: "#D52D2D",
    width: "100%",
    height: 1,
  },
  footer: {
    backgroundColor: "#D52D2D",
    width: "100%",
    height: 30,
  },
  senai_logo: {
    width: 109,
    height: 28,
    justifyContent: "center",
  },
  icon: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
    height: 50,
    width: "100%",

  },
});
