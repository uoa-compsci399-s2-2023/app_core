import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, TextInput,TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Screen } from "../components/Layout";

export default function TokensDetected({ route}) {
  const { scannedText } = route.params;
  
  const inputRef = useRef(null);

  const TITLE_TOKEN = 'title'
  const FOLDER_TOKEN = 'folder'
  const TASK_TOKEN = '#'

  const splitLines = scannedText.split(/\r?\n/);
  let cleanedTitle = "";
  let cleanedFolder = "";

  const title = splitLines.find(element => element.toLowerCase().startsWith(TITLE_TOKEN));
  const folder = splitLines.find(element => element.toLowerCase().startsWith(FOLDER_TOKEN));
  
  if (title) {
    cleanedTitle = title.match(/:\s*(.+)/)[1].trim()
  } else {
    cleanedTitle = `Tabs - ${new Date().toUTCString()}`;
  }

  if (folder) {
    cleanedFolder = folder.match(/:\s*(.+)/)[1].trim()
  } else {
    cleanedFolder = 'Unsorted';
  }

  const [isEditingFile, setIsEditingFIle] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editedTaskContent, setEditedTaskContent] = useState('');
  const [fileNameText, setText] = useState(cleanedTitle);

  const tasks = splitLines.filter(s => s.startsWith(TASK_TOKEN));
  
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
 
  return (
    <Screen>
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>FileName:</Text>
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
              /// get due date to calculate in the text after the @
                const rawDueDate = item.split('Due at:')[1];

                const dueDateParts = rawDueDate.split('/'); // Split the date string by '/'
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
                let indicatorColor = 'green';
                if (timeDifferenceInDays >= 1 && timeDifferenceInDays <= 2) {
                  indicatorColor = 'red';
                } else if (timeDifferenceInDays >= 3 && timeDifferenceInDays <= 5) {
                  indicatorColor = 'orange';
                }
                ///else if there no due date or cant find due date auto set due date to 7 days -> green
                else if (timeDifferenceInDays < 0) {
                  indicatorColor = 'green';
                }

                return (
                  <View key={index} style={styles.taskContainer}>
                    <View style={styles.taskIndicatorContainer}>
                      <View
                        style={[styles.taskIndicator, { backgroundColor: indicatorColor }]}
                      ></View>
                      <Text style={styles.taskIndicatorText}>
                        {timeDifferenceInDays <= 0
                          ? "Done"
                          : `Due in ${timeDifferenceInDays} day${timeDifferenceInDays !== 1 ? 's' : ''}`}
                      </Text>
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