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

  // Date extraction checkpoint
  //console.log("Extracted date: ", date);
  
  if (title) {
    cleanedTitle = title.substr(6).trim().replace(":", "");
  }



  if (folder !== -1 && date !== -1 && date > folder) {
    const agendaElements = fileName.slice(folder + 1, date);
    cleanedAgenda = agendaElements.join(' ').trim();
  }

  if (date !== -1) {
    const dateElement = fileName[date];
    cleanedDate = dateElement.substr(1).trim(); 

    // Checkpoint cleaned Date
    //console.log("Cleaned date: ", cleanedDate);
  }

  const [isEditingFile, setIsEditingFIle] = useState(false);
  const [isEditingAgen, setIsEditingAgen] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editedTaskContent, setEditedTaskContent] = useState('');
  const [fileNameText, setText] = useState(cleanedTitle + "-" + cleanedDate ); 
  const [agendaText, setAgendaText] = useState(cleanedAgenda);



  //list of task that extracted from the data where task will have # at the beginning and add the due date to the task list start with @ 
  let task = [];
  const taskIndex = fileName.findIndex(element => element.includes("#"));
  if (taskIndex !== -1) {
    task = fileName.slice(taskIndex);
  }
  
  // Replace "@" with "Due at:"
  const [taskList, setTaskList] = useState(task.map((item) => item.substr(1).trim().replace("@", "Due at: ")));

  // Checkpoint TaskList
  //console.log("TaskList: ", taskList);

  //const saveText = () => { ///to finish when we decide what to pass over 
  //if (inputRef.current) {
  //setText(inputRef.current.value);
  //}
  //};

  const editFileName = () => {
    setIsEditingFIle(!isEditingFile);
  };
  
  const editAgenda = () => {
    setIsEditingAgen(!isEditingAgen);
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
                
                // rawDueDate is undefined. Issue is somewhere above? Or extracted Date is undefine i.e. Textract + handwriting issue
                //console.log("rawDueDate: ", rawDueDate);

                const dueDateParts = rawDueDate.split('/'); // Split the date string by '/'
                const day = parseInt(dueDateParts[0], 10); // Parse day as an integer
                const month = parseInt(dueDateParts[1], 10) - 1; // Parse month (subtract 1 as months are zero-based)
                const year = parseInt(dueDateParts[2], 10); // Parse year
                const taskDueDate = new Date(year, month, day);

                // Calculate the time difference between now and the due date
                const currentDate = Date.now();

                //console.log("TaskDueDate: ", taskDueDate);
                //console.log("Current: ", currentDate);
                
                const timeDifferenceInDays = Math.floor(
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
                else if (timeDifferenceInDays <= 0) {
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
  







