import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, TextInput,TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import { Screen } from "../components/Layout";
import { Checkmark } from "../components/Modals.js";
import oneDrive from '../oneDrive';
import toDo from '../toDo';
import ScannedNote from '../models/ScannedNote';
import Task from '../models/Task';

export default function TokensDetected({ route, navigation }) {
  const { scannedText } = route.params;
  const scannedNote = new ScannedNote({ text: scannedText });
  const inputRef = useRef(null);

  const [isEditingFile, setIsEditingFile] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editedTaskContent, setEditedTaskContent] = useState('');
  const [fileName, setFileName] = useState(scannedNote.fileName);
  const [tasks, setTasks] = useState(scannedNote.tasks);
  const [showSpinner, setShowSpinner] = useState(false);
  const [checkmarkVisible, setCheckmarkVisible] = useState(false);

  const editFileName = () => {
    setIsEditingFile(!isEditingFile);
  };

  const toggleEditTask = (index, task) => {
    if (index === editingTaskIndex) {
      const updatedTasks = [...tasks];
      updatedTasks[index] = Task.fromDisplayableText(editedTaskContent);
      setTasks(updatedTasks); // Update the state with the edited task
      setEditingTaskIndex(null); // Exit edit mode
    } else {
      // Enter edit mode for the selected task
      setEditedTaskContent(task.displayableText);
      setEditingTaskIndex(index);
    }
  };

  async function uploadNote() {
    setShowSpinner(true);
    const defaultTaskList = await toDo.getDefaultTaskList();
    tasks.forEach(async t => {
      await toDo.createTask({
        taskListId: defaultTaskList.id,
        title: t.name,
        dateTime: t.formattedDateTime,
      });
    });
    await oneDrive.uploadFile({ body: scannedNote.body, path: `${scannedNote.folder}/${scannedNote.fileName}.txt` });
    setShowSpinner(false);
    setCheckmarkVisible(true);
    setTimeout(() => {
      setCheckmarkVisible(false);
      navigation.navigate('Scan');
    }, 1500)
  }
 
  return (
    <Screen>
      <Spinner
        visible={showSpinner}
        textContent={'Uploading...'}
      />
      <Checkmark visible={checkmarkVisible} />
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>File Name:</Text>
          <View style={styles.buttonContainer}>
            <Icon name="edit" size={25} color="black" style={styles.icon} onPress={editFileName} />
          </View>
        </View>
        <View style={styles.dataContainer}>
          {isEditingFile ? (
            <ScrollView style={styles.textInputFormat}>
              <TextInput 
                ref={inputRef}
                style={styles.input}
                value={fileName}
                onChangeText={(newFileName) => setFileName(newFileName)}
                multiline
                autoFocus
              />
            </ScrollView>
          ) : (
            <ScrollView>
              <Text>{fileName}</Text>
            </ScrollView>
          )}
          {isEditingFile ? (
            <TouchableOpacity onPress={editFileName}>
              <Text>Edit</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* display the folder name  */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Folder:</Text>
          <View style={styles.buttonContainer}>
          </View>
        </View>
        <View style={styles.dataContainer}>
          <ScrollView>
            <Text>{scannedNote.folder}</Text>
          </ScrollView>
        </View>
        <View>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Task:</Text>
            <View style={styles.buttonContainer}>
            </View>
          </View>
          <View style={styles.dataContainer}>
            {tasks.length > 0 ? (
              tasks.map((task, index) => {
                return (
                  <View key={index} style={styles.taskContainer}>
                    <View style={styles.taskIndicatorContainer}>
                      <View
                        style={[styles.taskIndicator, { backgroundColor: task.displayableIndicatorColor }]}
                      ></View>
                      <Text style={styles.taskIndicatorText}>{task.displayableDueDateText}</Text>
                      <Icon name="edit" size={25} color="black" style={styles.iconTask} onPress={() => toggleEditTask(index, task)} />
                    </View>
                    <View style={styles.taskTitleContainer}>
                      {editingTaskIndex === index ? (
                      // Edit mode: Show an editable input field
                        <TextInput
                          style={styles.taskTitleText}
                          value={editedTaskContent}
                          onChangeText={setEditedTaskContent}
                          onBlur={() => toggleEditTask(index, task)}
                          multiline
                          autoFocus
                        />
                      ) : (
                      // Display task text, make it clickable to enter edit mode
                        <TouchableOpacity onPress={() => toggleEditTask(index, task)}>
                          <Text style={styles.taskTitleText}>{task.displayableText}</Text>
                        </TouchableOpacity>
                      )}
                      
                    </View>
                  </View>
                );
              })
            ) : (
            // Display a message if there are no tasks
              <Text>No tasks found</Text>
            )}
          </View>
        </View>
        <View style={styles.nextIconContainer}>
          <TouchableOpacity onPress={uploadNote}>
            <Icon name="arrow-circle-o-right" size={100} color="black" />
          </TouchableOpacity>
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
    marginTop: 10,

  },

  iconTask: {
    marginLeft: 'auto',
  },

  nextIconContainer: {
    alignItems: 'center',
    marginTop: 20,
  },

  taskContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
  },

  taskIndicator: {
    borderRadius: 100,
    height: 20, 
    marginRight: 10,
    width: 50, 

  },

  taskIndicatorContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  taskIndicatorText: {
    color: 'gray',
    fontSize: 12,
    
  },
  taskTitleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  taskTitleText: {
    flex: 1,
    fontWeight: 'bold',
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