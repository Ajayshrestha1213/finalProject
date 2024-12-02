import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Avatar, Divider, Title, Subheading, IconButton } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import Logout from '../Auth/Logout';

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.userGreeting}>
            <Avatar.Image size={70} source={{ uri: user?.avatarUrl || 'https://via.placeholder.com/70' }} style={styles.avatar} />
            <View style={styles.greetingText}>
              <Title style={styles.greeting}>Hello, {user?.name || 'User'}!</Title>
              <Subheading style={styles.subheading}>Today, you can:</Subheading>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.profileButton]}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.buttonText}>View Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.taskButton]}
              onPress={() => navigation.navigate('Tasks')}
            >
              <Text style={styles.buttonText}>Manage Your Tasks</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.notesButton]}
              onPress={() => navigation.navigate('Notes')}
            >
              <Text style={styles.buttonText}>Take Quick Notes</Text>
            </TouchableOpacity>
          </View>

          <Logout navigation={navigation} />
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  card: {
    width: '90%',
    borderRadius: 16,
    elevation: 10,
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  userGreeting: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#6200ea',
    marginRight: 16,
  },
  greetingText: {
    marginLeft: 16,
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  subheading: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },
  divider: {
    marginVertical: 20,
  },
  buttonContainer: {
    marginVertical: 16,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  profileButton: {
    backgroundColor: '#6200ea',
  },
  taskButton: {
    backgroundColor: '#03dac6',
  },
  notesButton: {
    backgroundColor: '#ff9800',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ff5722',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;
