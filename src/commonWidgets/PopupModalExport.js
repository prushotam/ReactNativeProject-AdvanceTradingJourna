import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const PopupModalExport = ({ visible, onRequestClose, onExport }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionPress = (option) => {
    setSelectedOption(option);
  };

  const handleExportPress = () => {
    onExport(selectedOption);
    setSelectedOption('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onRequestClose}
      
    >
      <View style={styles.modal}>
        <Text style={styles.title}>Export Trades</Text>
        
        <View style={styles.options}>
          <TouchableOpacity
            style={[
              styles.option,
              selectedOption === 'open' ? styles.selectedOption : null,
            ]}
            onPress={() => handleOptionPress('open')}
          >
            <Text style={styles.optionText}>Open Trades</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.option,
              selectedOption === 'closed' ? styles.selectedOption : null,
            ]}
            onPress={() => handleOptionPress('closed')}
          >
            <Text style={styles.optionText}>Closed Trades</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.exportButton} onPress={handleExportPress}>
            <Text style={styles.exportButtonText}>Export</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onRequestClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
export default PopupModalExport;
const styles = StyleSheet.create({
  modal: {
    backgroundColor: `rgba(255, 255, 255, 1)`,
    borderRadius: 8,
    padding: 16,
    margin: 32,
    marginTop: 'auto',
    marginBottom: 'auto',
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  options: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  option: {
    borderWidth: 1,
    borderColor: '#010203',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  optionText: {
    fontSize: 16,
  },
  selectedOption: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  buttons: {
    flexDirection: 'row',
  },
  exportButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#000000',
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});


