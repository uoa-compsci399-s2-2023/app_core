import React, {useState} from "react";
import {Pressable, Image, StyleSheet, Text, View, TouchableOpacity} from "react-native";

import {lightTheme, scaledSize} from "../Theme";

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
      borderRadius: scaledSize(90),
      borderWidth: 8,
      flexDirection: "row",
      height: scaledSize(80),
      justifyContent: "center",
      width: scaledSize(80),
    },
    text: {
      fontSize: scaledSize(24),
      fontWeight: "bold"
    },
    textActive: {
      color: lightTheme.textAlt,
    },
    textDisabled: {
      color: lightTheme.text,
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
      {props.retakeMode ?
        <View></View> :
        <Text style={[styles.text, props.active ? styles.textActive : styles.textDisabled]}>{photos}</Text> }
    </Pressable>
  );
}

export function TextButton(props) {

  const styles = StyleSheet.create({
    text: {
      fontSize: scaledSize(24),
      fontWeight: "normal",
      textAlign: "center",
    },
    touchableOpacity: {
      width: scaledSize(75)
    }
  });

  const onButtonPress = () => {
    if (props.onPress != null && !props.disabled) {
      props.onPress();
    }
  };

  return (
    <TouchableOpacity style={styles.touchableOpacity} onPress={() => onButtonPress()}>
      {props.disabled ? <View></View> : <Text style={[styles.text, props.style]}>{props.buttonText}</Text>}
    </TouchableOpacity>
  );
}

export function TabsButton(props) {

  const styles = StyleSheet.create({
    pressable: {
      alignItems: "center",
      backgroundColor: lightTheme.brandColor,
      borderRadius: scaledSize(10),
      flexDirection: "row",
      height: scaledSize(40),
      justifyContent: "center",
      width: scaledSize(100)
    },
    text: {
      color: "white",
      fontSize: scaledSize(24),
      fontWeight: "normal",
      textAlign: "center",
    }
  });

  const onButtonPress = () => {
    if (props.onPress != null) {
      props.onPress();
    }
  };

  return (
    <Pressable style={styles.pressable} onPress={() => onButtonPress()}>
      <Text style={styles.text}>{props.text}</Text>
    </Pressable>
  );
}