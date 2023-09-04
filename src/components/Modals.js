import React, {useState} from "react";
import {Image, Modal, StyleSheet, Text, TextInput, View} from "react-native";
import {lightTheme} from "../Theme.js";

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
  errorText: {
    color: lightTheme.errorColor,
  },
  imageCheckmark: {
    height: 114,
    width: 114
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
  textInput: {
    borderBottomWidth: 1,
    height: 30,
    padding: 5,
    width: 250,
  },
  titleText: {
    fontWeight: "bold"
  },
  view: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    position: "absolute",
    width: "100%"
  },
  viewBackground: {
    backgroundColor: lightTheme.backgroundFocused
  },
  viewCheckmark: {
    alignItems: "center",
    backgroundColor: lightTheme.backgroundAlt,
    borderRadius: 14,
    display: "flex",
    height: 210,
    justifyContent: "center",
    position: "absolute",
    width: 210
  }
});

export function Alert(props) {

  if (!props.visible) {
    return <View></View>;
  }

  return (
    <Modal animationType="fade" hardwareAccelerated={true} transparent={true}>
      <View style={[styles.view, styles.viewBackground]}>
        <View style={styles.modal}>
          <Text style={styles.titleText}>{props.modalTitle}</Text>
          <Text style={styles.modalText}>{props.modalText}</Text>
          { props.isError ?
            (<Text style={styles.errorText} onPress={() => props.onConfirm(false)}>OK</Text>) :
            (<View style={styles.actionView}>
              <Text style={styles.actionText} onPress={() => props.onConfirm(false)}>Cancel</Text>
              <Text style={styles.actionText} onPress={() => props.onConfirm(true)}>OK</Text>
            </View>) }
        </View>
      </View>
    </Modal>
  );
}

export function Textbox(props) {

  /* Do we allow the programmer to register a onChangeText callback or should we pass the
  * string back on 'ok'?  */
  const [text, setText] = useState("");

  if (!props.visible) {
    return <View></View>;
  }

  const onConfirm = (string) => {
    props.onConfirm(string);
    setText("");
  }

  return (
    <Modal animationType="fade" hardwareAccelerated={true} transparent={true}>
      <View style={[styles.view, styles.viewBackground]}>
        <View style={styles.modal}>
          <Text style={styles.titleText}>{props.modalTitle}</Text>
          <TextInput style={styles.textInput} onChangeText={(currentText) => setText(currentText)} />
          <View style={styles.actionView}>
            <Text style={styles.actionText} onPress={() => onConfirm(null)}>Cancel</Text>
            <Text style={styles.actionText} onPress={() => onConfirm(text)}>OK</Text>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export function Checkmark(props) {

  if (!props.visible) {
    return <View></View>;
  }

  return (
    <Modal animationType="fade" hardwareAccelerated={true} transparent={true}>
      <View style={[styles.view]}>
        <View style={styles.viewCheckmark}>
          <Image source={require("../../assets/icons/checkmark.png")} style={styles.imageCheckmark}/>
        </View>
      </View>
    </Modal>
  )
}