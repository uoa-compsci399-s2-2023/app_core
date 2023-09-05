import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'expo-camera';
import GeneralButton from '../components/GeneralButton';
import CaptureButton from '../components/CaptureButton';
import { usePhoto } from '../ImageContext';

const Scan = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const cameraRef = useRef(null); //A hook that allows to directly create a reference to the DOM element in the functional component.
  const [pictureCount, setPictureCount] = useState(0);
  const { capturedPhotos, setCapturedPhotos } = usePhoto(); 

useEffect(() => {
  (async () => {
    //Getting permissions for accessing camera
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    setHasCameraPermission(cameraStatus.status === 'granted')
  })();
}, [])

const takePicture = async () => {
  if(cameraRef) {
    try{
      const data = await cameraRef.current.takePictureAsync();
      console.log(data);
      setPictureCount(pictureCount => pictureCount + 1)
      const updatedPhotos = [...capturedPhotos, data]; // Add the new photo to the existing list
      setCapturedPhotos(updatedPhotos); 
    } catch(e) {
      console.log(e);
    }
  }
}

const handleCancel = () => {
  setPictureCount(0); // Reset the counter
  setCapturedPhotos([]);
};

const handleDone = () => {
  console.log(capturedPhotos);
  if ( pictureCount > 0 ) {
    navigation.navigate('ImageGallery');
  }
}

if(hasCameraPermission === false) {
  return <Text>No access to Camera</Text>
}
  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera style ={styles.camera} ref={cameraRef} />
      </View>
      <View style={styles.captureContainer}>
        <CaptureButton count = {pictureCount} onPress={takePicture} />
      </View>
      <View style={styles.buttonFooter}>
        <GeneralButton title={"Cancel"} onPress={handleCancel}/>
        <GeneralButton title={"Done"} onPress={handleDone}/>
      </View>
    </View>
  )
}

export default Scan

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
    justifyContent: 'space-between',
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