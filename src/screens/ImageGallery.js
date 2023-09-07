import React from 'react'

import {Image, View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native'

import {lightTheme, scaledSize, SCREEN_HEIGHT} from "../Theme.js";
import {TabsButton} from "../components/Buttons.js";

export default function ImageGallery({ route, navigation }) {

  const {photos} = route.params;

  const imagePreview = (i) => {

    if (i >= photos.length) {
      return <View></View>
    }

    return (
      <TouchableOpacity style={styles.imagePreview} onPress={ () => navigation.navigate("Scan", { retakeMode: true, imageIndex: i})}>
        <Image source={{uri: photos.at(i).uri}} style={styles.image}/>
      </TouchableOpacity>
    );
  }

  const renderThumbnails = () => {

    const thumbnails = [];

    for (let i = 0; i < photos.length; i += 2) {

      thumbnails.push(
        <View key={i} style={[styles.row, styles.imageRow]}>
          {imagePreview(i)}
          {imagePreview(i + 1)}
        </View>
      );
    }
    return thumbnails;
  };

  return (
    <View style={styles.view}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {renderThumbnails()}
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.row}>
          <TabsButton text={"Cancel"} onPress={() => navigation.navigate("Login")}/>
          <TabsButton text={"Confirm"}/>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    bottom: "2%",
    flexDirection: "column",
    height: "10%",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
  },
  image: {
    borderRadius: scaledSize(10),
    height: "100%",
    resizeMode: "cover",
    width: "100%"
  },
  imagePreview: {
    height: "100%",
    width: "48%",
  },
  imageRow: {
    height: SCREEN_HEIGHT * 0.33,
    padding: "2%",
    width: "100%",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: "5%",
    paddingRight: "5%"
  },
  scrollView: {
    paddingBottom: "5%",
    paddingTop: "5%",
    width: "100%"
  },
  view: {
    backgroundColor: lightTheme.backgroundDark,
    flexDirection: "column",
    minHeight: "100%",
    width: "100%"
  }
})