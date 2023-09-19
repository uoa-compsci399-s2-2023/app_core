import React, {useState} from "react";
import {Image, Modal, StyleSheet, Text, TextInput, View} from "react-native";
import {lightTheme, scaledSize} from "../Theme.js";

const styles= StyleSheet.create({
  actionText: {
    color: lightTheme.accentColor,
    fontSize: scaledSize(14)
  },
  actionView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%"
  },
  errorText: {
    color: lightTheme.errorColor,
    fontSize: scaledSize(14)
  },
  imageCheckmark: {
    height: "55%",
    width: "55%"
  },
  modal: {
    alignItems: "center",
    backgroundColor: lightTheme.background,
    borderRadius: scaledSize(14),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "5%",
    rowGap: scaledSize(20),
    width: scaledSize(320)
  },
  modalText: {
    fontSize: scaledSize(14),
    textAlign: "center"
  },
  textInput: {
    borderBottomWidth: scaledSize(1),
    height: scaledSize(30),
    padding: scaledSize(5),
    width: "75%",
  },
  titleText: {
    fontSize: scaledSize(18),
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
    borderRadius: "10%",
    display: "flex",
    height: scaledSize(200),
    justifyContent: "center",
    position: "absolute",
    width: scaledSize(200)
  }
});

export function Alert(props) {

  if (!props.visible) {
    return <View></View>;
  }

  const onConfirm = (val) => {
    if (props.onConfirm) {
      props.onConfirm(val);
    }
  }

  return (
    <Modal animationType="fade" hardwareAccelerated={true} transparent={true}>
      <View style={[styles.view, styles.viewBackground]}>
        <View style={styles.modal}>
          <Text style={styles.titleText}>{props.modalTitle}</Text>
          <Text style={styles.modalText}>{props.modalText}</Text>
          { props.isError ?
            (<Text style={styles.errorText} onPress={() => onConfirm(false)}>OK</Text>) :
            (<View style={styles.actionView}>
              <Text style={styles.actionText} onPress={() => onConfirm(false)}>Cancel</Text>
              <Text style={styles.actionText} onPress={() => onConfirm(true)}>OK</Text>
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
    if (props.onConfirm) {
      props.onConfirm(string);
    }

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