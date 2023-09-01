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
  button: {
    backgroundColor: 'rgb(0, 120, 212)',
    borderRadius: 5,
    marginHorizontal: 20,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    height: '80%',
    resizeMode: 'contain',
    width: '80%',
  },
});

export default ImagePopup;