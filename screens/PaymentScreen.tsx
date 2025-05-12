import React from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';

export default function PaymentScreen({navigation, route}: any) {
 
  const handlePayment = () => {
    // Logique de paiement (placeholder)
    Alert.alert('Paiement effectué', 'Merci pour votre commande !');
    navigation.navigate('Home'); // Redirection après paiement
  };

  return (
    <View style={styles.ScreenContainer}>
      <Text style={styles.title}>Résumé du Paiement</Text>

      {/* Exemple de contenu de commande */}
      <View style={styles.summaryBox}>
        <Text style={styles.text}>Total : 59,99 €</Text>
        <Text style={styles.text}>Méthode : Carte bancaire</Text>
      </View>

      <Button title="Confirmer le paiement" onPress={handlePayment} />
    </View>
  );
}

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryBox: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
  },
});
