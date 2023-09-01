import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import ModalPopUp from '../components/ModalPopUp'; // Adjust the import path based on your project structure

const FileExplorer = ({ route, navigation }) => {
  const [visible, setVisible] = useState(false);
  const [selectedPhotoUri, setSelectedPhotoUri] = useState(null); // New state
  const { photos } = route.params;

  const handleOpenModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    navigation.navigate('Scan');
  };

  const renderThumbnails = () => {
    const thumbnails = [];
    for (let i = 0; i < photos.length; i += 2) {
      const firstPhoto = photos[i];
      const secondPhoto = photos[i + 1];
      thumbnails.push(
        <View key={i} style={styles.thumbnailRow}>
          <TouchableOpacity
            style={styles.thumbnailContainer}
            onPress={() => setSelectedPhotoUri(firstPhoto.uri)} // Set selected photo URI
          >
            <Image source={{ uri: firstPhoto.uri }} style={styles.thumbnail} />
          </TouchableOpacity>
          {secondPhoto && (
            <TouchableOpacity
              style={styles.thumbnailContainer}
              onPress={() => setSelectedPhotoUri(secondPhoto.uri)} // Set selected photo URI
            >
              <Image source={{ uri: secondPhoto.uri }} style={styles.thumbnail} />
            </TouchableOpacity>
          )}
        </View>
      );
    }
    return thumbnails;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderThumbnails()}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
      <ModalPopUp visible={visible} setVisible={setVisible} />
      {selectedPhotoUri && (
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
                  <Text style={styles.popupButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.popupButton}
                  onPress={() => setSelectedPhotoUri(null)}
                >
                  <Text style={styles.popupButtonText}>Retake</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "rgb(61, 152, 154)",
    borderRadius: 5,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
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
  scrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  thumbnail: {
    borderRadius: 10,
    height: '100%',
    resizeMode: 'cover',
    width: '100%',
  },
  thumbnailContainer: {
    aspectRatio: 1,
    padding: 5,
    width: '49%', // Display 2 thumbnails per row with a small gap between them
  },
  thumbnailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default FileExplorer;