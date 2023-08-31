import React from 'react';
import { View, Modal, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ImagePopup = ({ visible, imageUri, onCancel, onRetake }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.container}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onRetake}>
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: 'rgb(0, 120, 212)',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ImagePopup;