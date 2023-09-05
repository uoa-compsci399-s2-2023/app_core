import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';

const ImagePopup = ({ selectedPhotoUri, setSelectedPhotoUri, handleRetake }) => {
  if (!selectedPhotoUri) {
    return null;
  }

  return (
    <View style={styles.imagePopupContainer}>
      <TouchableOpacity
        style={styles.imagePopupBackground}
        onPress={() => setSelectedPhotoUri(null)}
      >
        <View style={styles.imagePopupContent}>
          <Image source={{ uri: selectedPhotoUri }} style={styles.imagePopup} />
          <View style={styles.imagePopupButtons}>
            <TouchableOpacity
              style={styles.popupButton}
              onPress={() => setSelectedPhotoUri(null)}
            >
              <Text style={styles.popupButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.popupButton}
              onPress={handleRetake}
            >
              <Text style={styles.popupButtonText}>Retake</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  imagePopup: {
    height: '90%',
    width: '100%',
  },
  imagePopupBackground: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: '60%',
    overflow: 'hidden',
    width: '80%',
  },
  imagePopupButtons: {
    borderTopColor: 'rgba(0, 0, 0, 0.2)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  imagePopupContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  imagePopupContent: {
    flex: 1,
  },
  popupButtonText: {
    backgroundColor: 'rgb(61, 152, 154)',
    borderRadius: 5,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
};

export default ImagePopup;