import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ItemDetail = ({ route }) => {
  const { itemId, itemName } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Item Detail</Text>
      <Text>Item ID: {itemId}</Text>
      <Text>Item Name: {itemName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 }
});

export default ItemDetail;
