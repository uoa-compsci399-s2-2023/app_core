import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Screen } from "../components/Layout";


export default function TokensDetected({ route}) {
  const { scannedText } = route.params;
  
  const fileName = scannedText.split(/\r?\n/);
  let cleanedTitle = "";
  let cleanedAgenda = "";
  let cleanedDate = "";
  const title = fileName.find(element => element.includes("Title"));
  const folder = fileName.findIndex(element => element.includes("Folder"));
  const date = fileName.findIndex(element => element.includes("@"));




  
  
  
  if (title) {
    const colonIndex = title.indexOf(":");
    if (colonIndex !== -1) {
      cleanedTitle = title.substring(colonIndex + 1).trim();
    }
  }

  if (folder !== -1 && date !== -1 && date > folder) {
    const agendaElements = fileName.slice(folder + 1, date);
    cleanedAgenda = agendaElements.join(' ').trim();
  }

  if (date !== -1) {
    const dateElement = fileName[date];
    cleanedDate = dateElement.substr(1).trim(); // Remove the "@" symbol and trim
  }

  const changeTitle = () => {
    const newTitle = prompt("Enter new title");
    if (newTitle) {
      cleanedTitle = newTitle;
    }
  }

  const changeAgenda = () => {
    const newAgenda = prompt("Enter new agenda");
    if (newAgenda) {
      cleanedAgenda = newAgenda;
    }
  }

  
  return (
    <Screen>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>FileName:</Text>
        <View style={styles.buttonContainer}>
          <Icon name="edit" size={25} color="black" style={styles.icon} onPress={changeTitle} />
        </View>
      </View>
      <View style={styles.dataContainer}>
        <Text>{cleanedTitle} - {cleanedDate}</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Agenda:</Text>
        <View style={styles.buttonContainer}>
          <Icon name="edit" size={25} color="black" style={styles.icon} onPress={changeAgenda} />
        </View>
      </View>
      <View style={styles.dataContainer}>
        <Text>{cleanedAgenda}</Text>
      </View>
      <View style={styles.nextIconContainer}>
        <Icon name="arrow-circle-o-right" size={100} color="black" />
      </View>
    </Screen>
  );
}


const styles = StyleSheet.create({
  dataContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  icon: {
    marginLeft: 'auto', 
    padding: 10,
  },
  nextIconContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  titleContainer: {
    alignItems: 'center', 
    backgroundColor: '#e0e0e0', 
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10,
    paddingLeft: 25,
  },
  titleText: {
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  
});






