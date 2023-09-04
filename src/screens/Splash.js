import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Image } from 'expo-image';

const Splash = ({ navigation }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 1500);

    return () => clearTimeout(timer);}, [navigation]);

  return(
    <View style={styles.container}>
      <Image 
        source={{uri: 'https://i.imgur.com/yUJFK9Y.gif'}} 
        style={styles.gifPosition} 
        contentFit="contain"
        contentPosition={'center'}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: "center",
  },

  gifPosition: {
    aspectRatio: 1,
    height: '75%',
  }

});

export default Splash;