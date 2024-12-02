import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, TouchableOpacity, Modal, Animated } from 'react-native';
import { firestore } from '../../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const QuickNotesScreen = () => {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState('');
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedContent, setUpdatedContent] = useState('');
  const [priority, setPriority] = useState('low');
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;

  const fetchNotes = async () => {
    if (user) {
      try {
        const q = query(collection(firestore, 'notes'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const notesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotes(notesList);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [user]);

  const handleAddNote = async () => {
    if (noteTitle && noteContent) {
      try {
        await addDoc(collection(firestore, 'notes'), {
          title: noteTitle,
          content: noteContent,
          priority: priority,
          userId: user.uid,
          createdAt: new Date(),
        });
        setNoteTitle('');
        setNoteContent('');
        setPriority('low');
        fetchNotes();
      } catch (error) {
        console.error('Error adding note:', error);
      }
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteDoc(doc(firestore, 'notes', noteId));
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleUpdateNote = async () => {
    if (updatedTitle && updatedContent && currentNoteId) {
      try {
        await updateDoc(doc(firestore, 'notes', currentNoteId), {
          title: updatedTitle,
          content: updatedContent,
          priority: priority,
        });
        setIsEditing(false);
        setUpdatedTitle('');
        setUpdatedContent('');
        setPriority('low');
        fetchNotes();
      } catch (error) {
        console.error('Error updating note:', error);
      }
    }
  };

  const showEditModal = (noteId, currentTitle, currentContent, currentPriority) => {
    setIsEditing(true);
    setCurrentNoteId(noteId);
    setUpdatedTitle(currentTitle);
    setUpdatedContent(currentContent);
    setPriority(currentPriority);
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchText.toLowerCase()) || 
    note.content.toLowerCase().includes(searchText.toLowerCase())
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.noUserText}>Please log in to take notes.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Quick Notes</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search Notes"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.addNoteContainer}>
        <TextInput
          style={styles.input}
          value={noteTitle}
          onChangeText={setNoteTitle}
          placeholder="Note Title"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          value={noteContent}
          onChangeText={setNoteContent}
          placeholder="Note Content"
          placeholderTextColor="#888"
        />
        <View style={styles.priorityContainer}>
          <Text style={styles.priorityText}>Priority: </Text>
          <TouchableOpacity 
            style={[styles.priorityButton, priority === 'high' && styles.highPriority]} 
            onPress={() => setPriority('high')}
          >
            <Text style={styles.priorityButtonText}>High</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.priorityButton, priority === 'low' && styles.lowPriority]} 
            onPress={() => setPriority('low')}
          >
            <Text style={styles.priorityButtonText}>Low</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
          <Text style={styles.addButtonText}>Add Note</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={filteredNotes}
          renderItem={({ item }) => (
            <View style={[styles.noteItem, item.priority === 'high' && styles.highPriorityItem]}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteContent}>{item.content}</Text>
              <View style={styles.noteActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => showEditModal(item.id, item.title, item.content, item.priority)}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteNote(item.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={item => item.id}
          style={styles.notesList}
        />
      )}

      <Modal visible={isEditing} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              value={updatedTitle}
              onChangeText={setUpdatedTitle}
              placeholder="Update Title"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              value={updatedContent}
              onChangeText={setUpdatedContent}
              placeholder="Update Content"
              placeholderTextColor="#888"
            />
            
            <View style={styles.priorityContainer}>
              <Text style={styles.priorityText}>Priority: </Text>
              <TouchableOpacity 
                style={[styles.priorityButton, priority === 'high' && styles.highPriority]} 
                onPress={() => setPriority('high')}
              >
                <Text style={styles.priorityButtonText}>High</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.priorityButton, priority === 'low' && styles.lowPriority]} 
                onPress={() => setPriority('low')}
              >
                <Text style={styles.priorityButtonText}>Low</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateNote}>
              <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f7f7f7',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
  },
  addNoteContainer: {
    marginBottom: 20,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    fontSize: 18,
    color: '#333',
  },
  priorityContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  priorityButton: {
    padding: 12,
    marginHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  highPriority: {
    borderColor: '#e74c3c',
    backgroundColor: '#f7b7b7',
  },
  lowPriority: {
    borderColor: '#27ae60',
    backgroundColor: '#a0e1a0',
  },
  priorityText: {
    fontSize: 18,
    color: '#f7f7f7',
  },
  priorityButtonText: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    padding: 16,
    backgroundColor: '#3498db',
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#f7f7f7',
    textAlign: 'center',
  },
  notesList: {
    marginTop: 20,
  },
  noteItem: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  noteContent: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  editButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  highPriorityItem: {
    borderColor: '#e74c3c',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  updateButton: {
    padding: 12,
    backgroundColor: '#3498db',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  updateButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 12,
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  noUserText: {
    fontSize: 18,
    color: '#f7f7f7',
    textAlign: 'center',
  },
});

export default QuickNotesScreen;
