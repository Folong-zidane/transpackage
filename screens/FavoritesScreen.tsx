import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
} from 'react-native';

export default function FavoritesScreen({navigation}: any) {
 

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{paddingBottom: 20}}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Vos Favoris</Text>
      
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 32,
  },
  card: {
    padding: 16,
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  removeText: {
    color: 'red',
    fontWeight: 'bold',
  },
});
