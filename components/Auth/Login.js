import React, { useState, useContext } from 'react';
import { TextInput, Button, Card, HelperText } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { signIn } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const Login = ({ navigation }) => {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const user = await signIn(email, password);
      setUser(user);
      navigation.navigate('Home');
    } catch (e) {
      setError('Login failed');
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
          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Log In
          </Button>
          <Button mode="text" onPress={() => navigation.navigate('Signup')}>
            Don't have an account? Sign Up
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

export default Login;
