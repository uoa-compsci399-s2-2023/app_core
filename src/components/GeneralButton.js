import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function GeneralButton({title, onPress}) {
  return(
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "rgb(61, 152, 154)",
    borderRadius: 5,
    minWidth: 130,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})