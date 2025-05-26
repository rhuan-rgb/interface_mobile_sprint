import React from "react";
import { Modal, View, StyleSheet, Pressable, Text } from "react-native";

const ModalBase = ({ open, onClose, children }) => {
  return (
    <Modal
      visible={open}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {children}
            <Pressable
              style={({ pressed }) => ({
                backgroundColor: pressed ? "#ddd" : "#fff",
              })}
            >
              <Text>Toque aqui</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: 300,
    elevation: 10, // sombra no Android
    shadowColor: "#000", // sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default ModalBase;
