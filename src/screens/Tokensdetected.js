import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, TextInput,TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Screen } from "../components/Layout";
import Spinner from 'react-native-loading-spinner-overlay';
import { parse, format } from 'date-fns';
import { Checkmark } from "../components/Modals.js";
import oneDrive from '../oneDrive';
import toDo from '../toDo';

export default function TokensDetected({ route, navigation }) {
  const { scannedText } = route.params;
  const inputRef = useRef(null);

  const TITLE_TOKEN = 'title'
  const FOLDER_TOKEN = 'folder'
  const TASK_TOKEN = '#'

  let tasks = [];
  let cleanedTitle = null;
  let cleanedFolder = null;

  // only iterate over text once, to enforce O(n) where n is the number of lies
  // if a string start with one token it will not start with another, this should remove some repeat processing
  scannedText.toLowerCase().split(/\r?\n/).forEach((text) => {

    const textTrimmed = text.trim();

    // find title if we don't have one
    if (cleanedTitle == null) {

      if (textTrimmed.toLowerCase().startsWith(TITLE_TOKEN)) {

        const titleRegex = textTrimmed.match(/:\s*(.+)/);

        if (titleRegex && titleRegex.length > 1) {
          cleanedTitle = titleRegex[1];
        }

        return;
      }
    }

    // find folder if we don't have one already
    if (cleanedFolder == null) {

      if (textTrimmed.toLowerCase().startsWith(FOLDER_TOKEN)) {

        const folderRegex = textTrimmed.match(/:\s*(.+)/);

        if (folderRegex && folderRegex.length > 1) {
          cleanedFolder = folderRegex[1];
        }

        return;
      }
    }

    // append any tasks we find into tasks list
    if (textTrimmed.toLowerCase().startsWith(TASK_TOKEN)) {
      tasks.push(textTrimmed);
    }
  })

  // set title and folder if we dont detect anything
  if (cleanedTitle == null) {
    cleanedTitle = `Tabs - ${new Date().toUTCString()}`;
  }

  if (cleanedFolder == null) {
    cleanedFolder = 'Unsorted';
  }

  const [isEditingFile, setIsEditingFIle] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editedTaskContent, setEditedTaskContent] = useState('');
  const [fileNameText, setText] = useState(cleanedTitle);

  // Replace "@" with "Due at:"
  const [taskList, setTaskList] = useState(tasks.map((item) => item.substr(1).trim().replace("@", "\nDue at: ")));

  const editFileName = () => {
    setIsEditingFIle(!isEditingFile);
  };

  const toggleEditTask = (index, initialContent) => {
    if (index === editingTaskIndex) {
      const updatedTaskList = [...taskList];
      updatedTaskList[index] = `#${editedTaskContent}`;
      setTaskList(updatedTaskList); // Update the state with the edited task
      setEditingTaskIndex(null); // Exit edit mode
    } else {
      // Enter edit mode for the selected task
      setEditedTaskContent(initialContent);
      setEditingTaskIndex(index);
    }
  };

  const [showSpinner, setShowSpinner] = useState(false);
  const [checkmarkVisible, setCheckmarkVisible] = useState(false);

  async function uploadNote() {
    setShowSpinner(true);
    const splitLines = scannedText.toLowerCase().split(/\r?\n/);
    const noteBody = splitLines.filter(s => !s.toLowerCase().startsWith(TITLE_TOKEN))
      .filter(s => !s.toLowerCase().startsWith(FOLDER_TOKEN))
      .filter(s => !s.startsWith(TASK_TOKEN))
    const defaultTaskList = await toDo.getDefaultTaskList();
    taskList.forEach(async t => {
      const [ title, dateTime ] = t.split('\nDue at: ');
      let formattedDateTime;
      if(dateTime) {
        formattedDateTime = format(parse(dateTime.trim(), 'dd/MM/yyyy', new Date()), 'MM/dd/yyyy')
      }
      await toDo.createTask({
        taskListId: defaultTaskList.id,
        title,
        dateTime: formattedDateTime,
      });
    });
    await oneDrive.uploadFile({ body: noteBody.join('\n'), path: `${cleanedFolder}/${cleanedTitle}.txt` });
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
                value={fileNameText}
                onChangeText={(newText) => setText(newText)}
                multiline
                autoFocus
              />
            </ScrollView>
          ) : (
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

        {/* display the folder name  */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Folder:</Text>
          <View style={styles.buttonContainer}>
          </View>
        </View>
        <View style={styles.dataContainer}>
          <ScrollView>
            <Text>{cleanedFolder}</Text>
          </ScrollView>
        </View>
            

        {/* Container with Issue START */}
        <View>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Task:</Text>
            <View style={styles.buttonContainer}>
            </View>
          </View>
          <View style={styles.dataContainer}>
            {/* Check if tasks exist */}
            {taskList.length > 0 ? (
            // Display the task list
              taskList.map((item, index) => {

                let indicatorColor = "grey";
                let dueText = "No due date";

                const passedDueDate = item.split('Due at:');

                // can not find due date in task
                if (passedDueDate.length > 1) {
                  const dueDateParts = passedDueDate[1].split('/'); // Split the date string by '/'
                  const day = parseInt(dueDateParts[0], 10); // Parse day as an integer
                  const month = parseInt(dueDateParts[1], 10) - 1; // Parse month (subtract 1 as months are zero-based)
                  const year = parseInt(dueDateParts[2], 10); // Parse year

                  const taskDueDate = new Date(year, month, day);

                  // Calculate the time difference between now and the due date
                  const currentDate = Date.now();

                  const timeDifferenceInDays = Math.ceil(
                    (taskDueDate - currentDate) / (1000 * 60 * 60 * 24)
                  );

                  // Indicator
                  if (timeDifferenceInDays >= 1 && timeDifferenceInDays <= 2) {
                    indicatorColor = 'red';
                  } else if (timeDifferenceInDays >= 3 && timeDifferenceInDays <= 5) {
                    indicatorColor = 'orange';
                  }
                  ///else if there no due date or cant find due date auto set due date to 7 days -> green
                  else {
                    indicatorColor = 'green';
                  }

                  dueText = timeDifferenceInDays <= 0  ? "Done" : `Due in ${timeDifferenceInDays} day${timeDifferenceInDays !== 1 ? 's' : ''}`
                }

                return (
                  <View key={index} style={styles.taskContainer}>
                    <View style={styles.taskIndicatorContainer}>
                      <View
                        style={[styles.taskIndicator, { backgroundColor: indicatorColor }]}
                      ></View>
                      <Text style={styles.taskIndicatorText}>{dueText}</Text>
                      <Icon name="edit" size={25} color="black" style={styles.iconTask} onPress={() => toggleEditTask(index, item)} />
                    </View>
                    <View style={styles.taskTitleContainer}>
                      {editingTaskIndex === index ? (
                      // Edit mode: Show an editable input field
                        <TextInput
                          style={styles.taskTitleText}
                          value={editedTaskContent}
                          onChangeText={setEditedTaskContent}
                          onBlur={() => toggleEditTask(index, item)}
                          multiline
                          autoFocus
                        />
                      ) : (
                      // Display task text, make it clickable to enter edit mode
                        <TouchableOpacity onPress={() => toggleEditTask(index, item)}>
                          <Text style={styles.taskTitleText}>{item}</Text>
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


        
        {/* Container with Issue END  */}

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