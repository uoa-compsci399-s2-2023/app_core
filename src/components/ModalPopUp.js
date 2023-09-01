import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
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
                  <Text style={[styles.editText, styles.FileName]}>
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
  FileName: {
    color: 'black',
  },
  arrowImage: {
    height: 20,
    width: 20,
  },
  button: {
    alignItems: 'center',
    borderRadius: 5,
    flex: 1,
    paddingVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'rgb(61, 152, 154)',
    marginRight: 10,
  },
  editButton: {
    color: 'rgb(61, 152, 154)',
    marginLeft: 10,
  },
  editRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  editText: {
    color: 'rgb(61, 152, 154)',
    marginLeft: 10,
  },
  editTextInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    flex: 1,
    padding: 5,
  },
  folderRow: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  folderText: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 30,
    justifyContent: 'center',
    width: '100%',
  },
  headerText: {
    color: 'rgb(61, 152, 154)',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoRow: {
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  infoText: {
    flex: 1,
  },
  modalBackground: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '80%',
  },
  modalContent: {
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'rgb(61, 152, 154)',
    marginLeft: 10,
  },
});

export default ModalPopUp;