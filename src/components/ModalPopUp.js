import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

const ModalPopUp = ({ visible, setVisible }) => {
  const [editingFileName, setEditingFileName] = useState(false);
  const [fileName, setFileName] = useState('My First Upload');
  const [editedFileName, setEditedFileName] = useState('');

  const handleEditButtonPress = () => {
    setEditingFileName(true);
    setEditedFileName(fileName);
  };

  const handleSaveButtonPress = () => {
    console.log('File Name:', editedFileName || fileName);
    setEditingFileName(false);
    setFileName(editedFileName);
    setVisible(false); // Close the popup
  };

  const handleBlur = () => {
    setEditingFileName(false);
  };

  const handleClosePopup = () => {
    setVisible(false);
  };

  return (
    <Modal transparent visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Save as</Text>
            </View>
            <View style={styles.folderRow}>
              <Text style={styles.folderText}>Folder: Project Launch</Text>
              <TouchableOpacity onPress={() => console.log('Edit button pressed')}>
                <Image source={require('../../assets/arrow.png')} style={styles.arrowImage} />
              </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>File Name:</Text>
              {editingFileName ? (
                <TextInput
                  style={styles.editTextInput}
                  value={editedFileName}
                  onChangeText={setEditedFileName}
                  onBlur={handleBlur}
                  autoFocus
                />
              ) : (
                <View style={styles.editRow}>
                  <Text style={[styles.editText, { color: 'black' }]}>
                    {editedFileName || fileName}
                  </Text>
                  <TouchableOpacity onPress={handleEditButtonPress}>
                    <Text style={styles.editButton}>Edit</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleClosePopup}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveButtonPress}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 20,
  },
  modalContent: {
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerText: {
    color: 'rgb(61, 152, 154)',
    fontWeight: 'bold',
    fontSize: 20,
  },
  folderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  folderText: {
    flex: 1,
  },
  arrowImage: {
    height: 20,
    width: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
  },
  editText: {
    color: 'rgb(61, 152, 154)',
    marginLeft: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgb(61, 152, 154)',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: 'rgb(61, 152, 154)',
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  editTextInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 5,
    borderRadius: 5,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    color: 'rgb(61, 152, 154)',
    marginLeft: 10,
  },
});

export default ModalPopUp;