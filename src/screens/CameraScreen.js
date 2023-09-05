import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'expo-camera';
import GeneralButton from '../components/GeneralButton';
import CaptureButton from '../components/CaptureButton';
import { usePhoto } from '../ImageContext';
import { useRoute } from '@react-navigation/native';

const CameraScreen = ({ navigation }) => {
  const cameraRef = useRef(null); //A hook that allows to directly create a reference to the DOM element in the functional component.
  const { capturedPhotos, setCapturedPhotos } = usePhoto(); 
  const route = useRoute();
  const selectedPhotoUri = route.params.selectedPhotoUri;

const takePicture = async () => {
  if(cameraRef) {
    try{
      console.log(selectedPhotoUri);
      const data = await cameraRef.current.takePictureAsync();
      console.log(data);

      // Create a copy of the capturedPhotos array
      const updatedPhotos = [...capturedPhotos];

      // Find the index of the photo with the matching URI
      const photoIndex = updatedPhotos.findIndex(photo => photo.uri === selectedPhotoUri);

      if (photoIndex !== -1) {
        // Replace the photo with the matching URI
        updatedPhotos[photoIndex] = data;
      }

      setCapturedPhotos(updatedPhotos);
      navigation.navigate('ImageGallery');
    } catch(e) {
      console.log(e);
    }
  }
}

const handleCancel = () => {
  console.log("Cancel");
  navigation.navigate('ImageGallery');
}

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera style ={styles.camera} ref={cameraRef} />
      </View>
      <View style={styles.captureContainer}>
        <CaptureButton onPress={takePicture} />
      </View>
      <View style={styles.buttonFooter}>
        <GeneralButton title={"Cancel"} onPress={handleCancel}/>
      </View>
    </View>
  )
}

export default CameraScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(61, 152, 154)',
    justifyContent: 'center',
  },
  camera: {
    borderRadius: 20,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * (4/3),
  },
  buttonFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  captureContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
  },
  cameraContainer: {
    flex: 1,
    paddingTop: 50,
  },
})