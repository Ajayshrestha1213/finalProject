import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { logOut } from '../../services/api';

const ProfileScreen = () => {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    await logOut();
    setUser(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profilePicContainer}>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
          style={styles.profilePic}
        />
      </View>

      <Text style={styles.welcomeText}>Welcome back,</Text>
      <Text style={styles.username}>{user?.email}</Text>
      
      <View style={styles.additionalInfo}>
        <Text style={styles.infoText}>Joined: 2024</Text>
        <Text style={styles.infoText}>Last login: 2 hours ago</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f9',
    padding: 20,
  },
  profilePicContainer: {
    backgroundColor: '#fff',
    borderRadius: 100,
    padding: 5,
    marginBottom: 20,
    elevation: 5,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  username: {
    fontSize: 20,
    color: '#666',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    elevation: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  additionalInfo: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
});

export default ProfileScreen;
