import React, {useState} from "react";
import {Pressable, Image, StyleSheet, Text} from "react-native";

import {lightTheme} from "../Theme";

export function LoginButton(props) {

  const styles = StyleSheet.create({
    icon: {
      height: 23,
      width: 23
    },
    pressable: {
      alignItems: "center",
      borderColor: lightTheme.controlOutline,
      borderRadius: 0,
      borderWidth: 2,
      flexDirection: "row",
      gap: 10,
      height: 50,
      justifyContent: "flex-start",
      padding: 10,
      width: 250
    },
    text: {
      color: lightTheme.text,
      fontSize: 18,
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
      borderRadius: 90,
      borderWidth: 8,
      flexDirection: "row",
      height: 80,
      justifyContent: "center",
      width: 80,
    },
    text: {
      color: lightTheme.textAlt,
      fontSize: 24,
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
      <Text style={styles.text}>{photos}</Text>
    </Pressable>
  );
}