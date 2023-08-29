import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, TextInput,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Screen } from "../components/Layout";




export default function TokensDetected({ route}) {
  const { scannedText } = route.params;
  const inputRef = useRef(null);


  
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
    cleanedDate = dateElement.substr(1).trim(); 
  }


  const [isEditing, setIsEditing] = useState(false);
  const [fileNameText, setText] = useState(cleanedTitle + "-" + cleanedDate ); 
  const [agendaText, setAgendaText] = useState(cleanedAgenda);

  const editText = () => {
    setIsEditing(!isEditing);
  };

  const saveText = () => {
    if (inputRef.current) {
      setText(inputRef.current.value);
      setIsEditing(false);
    }
  };



  
  return (
    <Screen>
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>FileName:</Text>
          <View style={styles.buttonContainer}>
            <Icon name="edit" size={25} color="black" style={styles.icon} onPress={editText} />
          </View>
        </View>
        <View style={styles.dataContainer}>
          {isEditing ? (
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={fileNameText}
              onChangeText={(newText) => setText(newText)}
              autoFocus
            />
          ) : (
            <Text>{fileNameText}</Text>
          )}
          {isEditing ? (
            <TouchableOpacity onPress={editText}>
              <Text>Edit</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>


      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Agenda:</Text>
          <View style={styles.buttonContainer}>
            <Icon name="edit" size={25} color="black" style={styles.icon} onPress={editText} />
          </View>
        </View>
        <View style={styles.dataContainer}>
          {isEditing ? (
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={agendaText}
              onChangeText={(newText) => setAgendaText(newText)}
              autoFocus
            />
          ) : (
            <Text>{agendaText}</Text>
          )}
          {isEditing ? (
            <TouchableOpacity onPress={editText}>
              <Text>Edit</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>


      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Agenda:</Text>
        <View style={styles.buttonContainer}>
          <Icon name="edit" size={25} color="black" style={styles.icon} onPress={editText} />
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






