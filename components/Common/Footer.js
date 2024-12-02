import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Copyright 2024</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#2196F3', position: 'absolute', bottom: 0, width: '100%' },
  text: { color: '#fff' }
});

export default Footer;
