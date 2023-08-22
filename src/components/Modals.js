import React from "react";
import {Modal, StyleSheet, Text, View} from "react-native";
import {lightTheme} from "../Theme.js";

export function Alert(props) {

  const styles= StyleSheet.create({
    actionText: {
      color: lightTheme.accentColor,
    },
    actionView: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "80%"
    },
    modal: {
      alignItems: "center",
      backgroundColor: lightTheme.background,
      borderRadius: 14,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: 20,
      rowGap: 20,
      width: 320
    },
    modalText: {
      textAlign: "center",
    },
    titleText: {
      fontWeight: "bold"
    },
    view: {
      alignItems: "center",
      backgroundColor: lightTheme.backgroundFocused,
      display: "flex",
      height: "100%",
      justifyContent: "center",
      position: "absolute",
      width: "100%"
    }
  });

  if (!props.visible) {
    return <View></View>;
  }

  return (
    <Modal animationType="fade" hardwareAccelerated={true} transparent={true}>
      <View style={styles.view}>
        <View style={styles.modal}>
          <Text style={styles.titleText}>{props.modalTitle}</Text>
          <Text style={styles.modalText}>{props.modalText}</Text>
          <View style={styles.actionView}>
            <Text style={styles.actionText} onPress={() => props.onConfirm(false)}>Cancel</Text>
            <Text style={styles.actionText} onPress={() => props.onConfirm(true)}>OK</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}