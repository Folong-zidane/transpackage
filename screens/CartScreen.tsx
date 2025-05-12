import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

export default function CartScreen({navigation, route}: any) {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <ScrollView contentContainerStyle={{paddingBottom: tabBarHeight + 20}}>
        <Text style={styles.title}>Votre Panier</Text>

        {/* Exemple de produit */}
        <View style={styles.item}>
          <Text>Produit 1</Text>
        </View>

        <View style={styles.item}>
          <Text>Produit 2</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Payment')}>
          <Text style={styles.buttonText}>Passer à la caisse</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 20,
  },
  item: {
    padding: 16,
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
