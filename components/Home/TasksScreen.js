import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, TouchableOpacity, Modal } from 'react-native';
import { getAuth } from 'firebase/auth';
import { firestore } from '../../config/firebase';  // Import Firestore instance from firebase.js
import { collection, addDoc, query, getDocs, deleteDoc, doc, updateDoc, where } from 'firebase/firestore';

const TasksScreen = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState('');
  const [updatedTask, setUpdatedTask] = useState('');
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch tasks for the authenticated user
  const fetchTasks = async () => {
    if (user) {
      try {
        const q = query(collection(firestore, 'tasks'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const tasksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(tasksList);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTasks(); // Initial fetch when the component mounts
  }, [user]);

  // Handle adding a new task
  const handleAddTask = async () => {
    if (task) {
      try {
        await addDoc(collection(firestore, 'tasks'), {
          text: task,
          createdAt: new Date(),
          userId: user.uid,  // Associate task with user
        });
        setTask('');
        fetchTasks();  // Refresh task list after adding
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(firestore, 'tasks', taskId));
      fetchTasks();  // Refresh task list after deleting
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Handle updating a task
  const handleUpdateTask = async () => {
    if (updatedTask && currentTaskId) {
      try {
        await updateDoc(doc(firestore, 'tasks', currentTaskId), {
          text: updatedTask,
        });
        setIsEditing(false);
        setUpdatedTask('');
        fetchTasks();  // Refresh task list after update
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  // Show edit modal
  const showEditModal = (taskId, currentText) => {
    setIsEditing(true);
    setCurrentTaskId(taskId);
    setUpdatedTask(currentText);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>You need to be logged in to view tasks.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Tasks</Text>
      <TextInput
        style={styles.input}
        value={task}
        onChangeText={setTask}
        placeholder="Add a new task"
      />
      <Button title="Add Task" onPress={handleAddTask} />

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskText}>{item.text}</Text>
              <View style={styles.taskActions}>
                <TouchableOpacity onPress={() => showEditModal(item.id, item.text)}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={item => item.id}
          style={styles.taskList}
        />
      )}

      <Modal visible={isEditing} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              value={updatedTask}
              onChangeText={setUpdatedTask}
              placeholder="Update task"
            />
            <Button title="Update" onPress={handleUpdateTask} />
            <Button title="Cancel" onPress={() => setIsEditing(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    width: '100%',
  },
  taskList: {
    marginTop: 20,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  taskActions: {
    flexDirection: 'row',
  },
  editText: {
    color: '#4caf50',
    marginRight: 10,
  },
  deleteText: {
    color: '#ff5722',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
});

export default TasksScreen;
