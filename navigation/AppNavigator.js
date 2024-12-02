import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';
import HomeScreen from '../components/Home/HomeScreen';
import ProfileScreen from '../components/Home/ProfileScreen';
import TasksScreen from '../components/Home/TasksScreen';
import Header from '../components/Common/Header';
import QuickNotesScreen from '../components/Home/QuickNotesScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Tasks" component={TasksScreen} />
      <Stack.Screen name="Notes" component={QuickNotesScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
