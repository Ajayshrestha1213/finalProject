import React, { useState } from 'react';
import { TextInput, Button, Card, HelperText } from 'react-native-paper';
import { View, StyleSheet, Alert } from 'react-native';
import { signUp } from '../../services/api';

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      await signUp(email, password);
      Alert.alert('Signup Successful', 'You can now log in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (e) {
      if (e.message.includes('email-already-in-use')) {
        setError('This email is already in use. Please choose another one.');
      } else if (e.message.includes('weak-password')) {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Signup failed. Please try again with valid email id and password.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
          />
          {error && <HelperText type="error">{error}</HelperText>}
          <Button mode="contained" onPress={handleSignup} style={styles.button}>
            Sign Up
          </Button>
          <Button mode="text" onPress={() => navigation.navigate('Login')}>
            Already have an account? Log In
          </Button>
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
    padding: 20,
  },
  card: {
    width: '100%',
    padding: 20,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginVertical: 12,
  },
});

export default Signup;
