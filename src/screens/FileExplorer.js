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
    container: {
      flex: 1,
      justifyContent: 'space-between',
    },
    scrollContainer: {
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    thumbnailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    thumbnailContainer: {
      width: '49%', // Display 2 thumbnails per row with a small gap between them
      aspectRatio: 1,
      padding: 5,
    },
    thumbnail: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      borderRadius: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        backgroundColor: "rgb(61, 152, 154)",
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    imagePopupContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      },
      imagePopupBackground: {
        width: '80%',
        height: '60%',
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
      },
      imagePopupContent: {
        flex: 1,
      },
      imagePopup: {
        width: '100%',
        height: '90%',
      },
      imagePopupButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingHorizontal: 20,
        borderTopColor: 'rgba(0, 0, 0, 0.2)',
      },
      popupButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: 'rgb(61, 152, 154)',
      },
  });

export default FileExplorer;