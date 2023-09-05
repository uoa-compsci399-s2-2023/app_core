import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { usePhoto } from '../ImageContext';
import GeneralButton from '../components/GeneralButton';
import ImagePopup from '../components/ImagePopup';
import { useNavigation } from '@react-navigation/native';

const ImageGallery = () => {
  const navigation = useNavigation();
  const [selectedPhotoUri, setSelectedPhotoUri] = useState(null); 
  const { capturedPhotos } = usePhoto(); 

  const handleRetake = () => {
    navigation.navigate('CameraScreen', { selectedPhotoUri });
    setSelectedPhotoUri(null);
  }; 

  const handleCancel = () => {
    navigation.navigate('Scan');
  };

  const handleDone = () => {
    console.log("yeeee");
  } 

  const renderThumbnails = () => {
    const thumbnails = [];
    for (let i = 0; i < capturedPhotos.length; i += 2) {
      const firstPhoto = capturedPhotos[i];
      const secondPhoto = capturedPhotos[i + 1];
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
      <View style={styles.buttonFooter}>
        <GeneralButton title={"Cancel"} onPress={handleCancel}/>
        <GeneralButton title={"Done"} onPress={handleDone}/>
      </View>
      <ImagePopup
        selectedPhotoUri={selectedPhotoUri}
        setSelectedPhotoUri={setSelectedPhotoUri}
        handleRetake={handleRetake}
      />
    </View>
  )
}

export default ImageGallery

const styles = StyleSheet.create({
  buttonFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  thumbnail: {
    borderRadius: 10,
    height: '100%',
    resizeMode: 'cover',
    width: '100',
  },
  thumbnailContainer: {
    aspectRatio: 3/4,
    padding: 5,
    width: '50%', // Display 2 thumbnails per row with a small gap between them
  },
  thumbnailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
})