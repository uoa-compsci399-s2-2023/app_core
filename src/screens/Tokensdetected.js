import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, TextInput,TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Screen } from "../components/Layout";

export default function TokensDetected({ route}) {
  // NOTE: Used placeholderNotes for testing
  // const placeholderNotes = "Title:     (Oh, What A Night) @December1963 Oh, what a night/nLate December, back in '63/n/nWhat a very special time for me/nAs I remember, what a night/nOh, what a night/nYou know, I didn't even/n know her name/nBut I was never gonna be the same/nWhat a lady, what a night/nOh, I, I got a funny feeling/nWhen she walked in the room/nAnd my, as I recall/nIt ended much too soon/n/n(Oh, what a night)/nHypnotizing, mesmerizin' me/nShe was everything I dreamed she'd be/nSweet surrender, what a night/n/nAnd I felt a rush/nLike a rolling bolt of thunder/nSpinning my head around/nAnd takin' my body under/n(Oh, what a night)/nOh, I got a funny feeling/nWhen she walked in the room/nAnd my, as I recall/nIt ended much too soon/n/n(Oh, what a night)/nWhy'd it take so long to see the light?/nSeemed so wrong, but now it seems so right/nWhat a lady, what a night/n/nOh, I felt a rush/nLike a rolling bolt of thunder/nSpinning my head around/nAnd takin' my body under/n/n(Oh, what a night)/nDo do do, do do, do do do do/n(Oh, what a night)/nDo do do, do do, do do do do/n(Oh, what a night)/nDo do do, do do, do do do do/n(Oh, what a night)/nDo do do, do do, do do do do.../n"
  const { scannedText } = route.params;
  
  const inputRef = useRef(null);
  
  // NOTE: Used placeholderNotes for testing
  // const fileName = placeholderNotes.split(/\r?\n/);
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

  const [isEditingFile, setIsEditingFIle] = useState(false);
  const [isEditingAgen, setIsEditingAgen] = useState(false);
  const [fileNameText, setText] = useState(cleanedTitle + "-" + cleanedDate ); 
  const [agendaText, setAgendaText] = useState(cleanedAgenda);

  const saveText = () => {
    if (inputRef.current) {
      setText(inputRef.current.value);
    }
  };

  const editFileName = () => {
    setIsEditingFIle(!isEditingFile);
  };
  
  const editAgenda = () => {
    setIsEditingAgen(!isEditingAgen);
  };
 
  return (
    <Screen>
      {/* Changed to ScrollView -- ScrollView handles overflows for anything enclosed in the component*/}
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>FileName:</Text>
          <View style={styles.buttonContainer}>
            <Icon name="edit" size={25} color="black" style={styles.icon} onPress={editFileName} />
          </View>
        </View>
        <View style={styles.dataContainer}>
          {isEditingFile ? (
            // Added ScrollView
            <ScrollView style={styles.textInputFormat}>
              <TextInput 
                ref={inputRef}
                style={styles.input}
                value={fileNameText}
                onChangeText={(newText) => setText(newText)}
                // Multiline allows entire fileNameText to fill in textBox
                multiline
                autoFocus
              />
            </ScrollView>
          ) : (
            // Added ScrollView
            <ScrollView>
              <Text>{fileNameText}</Text>
            </ScrollView>
          )}
          {isEditingFile ? (
            <TouchableOpacity onPress={editFileName}>
              <Text>Edit</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Agenda:</Text>
            <View style={styles.buttonContainer}>
              <Icon name="edit" size={25} color="black" style={styles.icon} onPress={editAgenda} />
            </View>
          </View>
          <View style={styles.dataContainer}>
            {isEditingAgen ? (
              // Added ScrollView 
              <ScrollView>
                <TextInput
                  ref={inputRef}
                  style={styles.dataContainer}
                  value={agendaText}
                  onChangeText={(newText) => setAgendaText(newText)}
                  multiline={true}
                  autoFocus
                />
              </ScrollView>
            ) : (
              // Added ScrollView
              <ScrollView>
                <Text>{agendaText}</Text>
              </ScrollView>
            )}
            {isEditingAgen ? (
              <TouchableOpacity onPress={editAgenda}>
                <Text>Edit</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <View style={styles.nextIconContainer}>
          <Icon name="arrow-circle-o-right" size={100} color="black" />
        </View>
      </ScrollView>
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






