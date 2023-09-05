import * as React from 'react';
import { View } from 'react-native';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function GeneralButton({count, onPress}) {
  return(
    <TouchableOpacity style={styles.captureButtonOuter} onPress={onPress}>
      <View style={styles.captureButtonInner}>
        <View style={[styles.middleWhiteCircle]} />
        <Text style={styles.pictureCountText}>{count}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  captureButtonInner: {
    alignItems: 'center',
    backgroundColor: 'rgb(61, 152, 154)',
    borderRadius: 40,
    height: 65,
    justifyContent: 'center',
    position: 'relative',
    width: 65,
  },
  captureButtonOuter: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 40,
    height: 75,
    justifyContent: 'center',
    width: 75,
  },
  middleWhiteCircle: {
    backgroundColor: '#fff',
    borderRadius: 999,
    height: 55,
    position: 'absolute',
    width: 55,
  },
  pictureCountText: {
    color: '#000',
    fontSize: 25,
    position: 'absolute',
  },
})