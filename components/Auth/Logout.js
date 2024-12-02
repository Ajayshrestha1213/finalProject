import React, { useContext } from 'react';
import { Button } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';

const Logout = ({ navigation }) => {
  const { setUser } = useContext(AuthContext);

  const handleLogout = () => {
    setUser(null);
    navigation.navigate('Login');
  };

  return <Button onPress={handleLogout}>Log Out</Button>;
};

export default Logout;
