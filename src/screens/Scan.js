import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';

const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [pictureCount, setPictureCount] = useState(0);
  const [photos, setPhotos] = useState([]);
  const cameraRef = useRef(null);

  useEffect(() => {
    const requestCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    requestCameraPermissions();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log(photo);
      setPictureCount(count => count + 1);
      setPhotos(prevPhotos => [...prevPhotos, photo]);
    }
  };

  const handleCancel = () => {
    setPhotos([]); // Clear the photos array
    setPictureCount(0); // Reset the counter
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const windowWidth = Dimensions.get('window').width;
  const aspectRatio = 4 / 3;

  const canPressDone = photos.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header} />
      <View style={styles.cameraContainer}>
        <Camera
          style={{
            width: windowWidth,
            height: windowWidth * aspectRatio,
          }}
          type={Camera.Constants.Type.back}
          ref={cameraRef}
        />
      </View>
      <View style={styles.captureFooter}>
        <TouchableOpacity style={styles.captureButtonOuter} onPress={takePicture}>
          <View style={styles.captureButtonInner}>
            <View style={[styles.middleWhiteCircle]} />
            <Text style={styles.pictureCountText}>{pictureCount}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonFooter}>
        <TouchableOpacity style={styles.button} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, !canPressDone]} onPress={() => navigation.navigate('FileExplorer', { photos })} disabled={!canPressDone}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  buttonFooter: {
    alignItems: 'center',
    backgroundColor: 'rgb(61, 152, 154)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
  },
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
  captureFooter: {
    alignItems: 'center',
    backgroundColor: 'rgb(61, 152, 154)',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 0,
    paddingBottom: 10,
  },
  container: {
    backgroundColor: 'rgb(61, 152, 154)',
    flex: 1,
  },
  header: {
    backgroundColor: 'rgb(61, 152, 154)',
    height: 50,
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
});

export default CameraScreen;