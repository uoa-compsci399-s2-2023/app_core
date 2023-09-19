import React, {useState} from "react";
import {Pressable, Image, StyleSheet, Text, View} from "react-native";

import {lightTheme, scaledSize} from "../Theme";

export function LoginButton(props) {

  const styles = StyleSheet.create({
    icon: {
      height: scaledSize(23),
      width: scaledSize(23),
    },
    pressable: {
      alignItems: "center",
      borderColor: lightTheme.controlOutline,
      borderRadius: 0,
      borderWidth: 2,
      flexDirection: "row",
      gap: "5%",
      height: "5%",
      justifyContent: "flex-start",
      maxHeight: scaledSize(50),
      maxWidth: scaledSize(250),
      padding: "2%",
      width: "65%"
    },
    text: {
      color: lightTheme.text,
      fontSize: scaledSize(18),
      fontWeight: "normal"
    }
  });

  return (
    <Pressable style={styles.pressable} {...props}>
      <Image source={props.icon} style={styles.icon}/>
      <Text style={styles.text}>{props.text}</Text>
    </Pressable>
  );
}

export function CaptureButton(props) {

  const styles = StyleSheet.create({
    pressable: {
      alignItems: "center",
      backgroundColor: lightTheme.background,
      borderColor: lightTheme.controlOutlineAlt,
      borderRadius: "100%",
      borderWidth: "10%",
      flexDirection: "row",
      height: scaledSize(80),
      justifyContent: "center",
      width: scaledSize(80),
    },
    text: {
      color: lightTheme.textAlt,
      fontSize: scaledSize(24),
      fontWeight: "bold"
    }
  });

  const [photos, setPhotos] = useState(0);

  const onButtonPress = (numPhotos) => {

    if (!props.active) {
      return;
    }

    // increment per press, reset when??
    setPhotos(prev => prev + 1);

    if (props.onPress != null) {
      props.onPress(numPhotos);
    }
  };

  return (
    <Pressable style={styles.pressable} onPress={() => onButtonPress(photos)}>
      {props.retakeMode ? <View></View> : <Text style={styles.text}>{photos}</Text> }
    </Pressable>
  );
}