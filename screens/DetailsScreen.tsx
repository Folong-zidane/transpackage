import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

export default function DetailsScreen({ navigation, route }: any) {
  const { item } = route.params || {}; // Données passées depuis un autre écran

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {item?.image && (
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        )}
        <Text style={styles.title}>{item?.title || 'Nom du produit'}</Text>
        <Text style={styles.description}>
          {item?.description || 'Description du produit à compléter.'}
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Retour</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 30,
  },
  button: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
