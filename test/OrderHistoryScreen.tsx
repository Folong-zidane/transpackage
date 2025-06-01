import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OrderHistoryScreen = ({ navigation }: any) => {
  // Données d'historique de commandes (exemple agence de livraison)
  const orders = [
    { id: '1', date: '2025-05-10', total: 49.99, tracking: 'AB123456789', status: 'Livré' },
    { id: '2', date: '2025-05-09', total: 29.50, tracking: 'CD987654321', status: 'En transit' },
    { id: '3', date: '2025-05-08', total: 75.00, tracking: 'EF456123789', status: 'En attente' },
    { id: '4', date: '2025-05-07', total: 15.25, tracking: 'GH321654987', status: 'Livré' },
    { id: '5', date: '2025-05-06', total: 120.00, tracking: 'IJ159753486', status: 'En transit' },
    { id: '6', date: '2025-05-05', total: 89.50, tracking: 'KL753159486', status: 'Livré' },
    { id: '7', date: '2025-05-04', total: 60.75, tracking: 'MN852369741', status: 'En attente' },
    { id: '8', date: '2025-05-03', total: 33.25, tracking: 'OP963147258', status: 'En transit' },
    { id: '9', date: '2025-05-02', total: 45.00, tracking: 'QR147258369', status: 'Livré' },
    { id: '10', date: '2025-05-01', total: 99.99, tracking: 'ST258369147', status: 'En attente' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Agence Express - Historique des colis</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {orders.map(order => (
          <View key={order.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="local-shipping" size={24} color="#1a73e8" />
              <Text style={styles.tracking}>N° de suivi: {order.tracking}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.text}>Date: <Text style={styles.bold}>{order.date}</Text></Text>
              <Text style={styles.text}>Montant: <Text style={styles.bold}>{order.total.toFixed(2)*100} FCFA</Text></Text>
              <Text style={styles.text}>Statut: <Text style={[styles.status, styles[order.status.replace(/ /g, '').toLowerCase()]]}>{order.status}</Text></Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1a73e8',
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tracking: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  cardBody: {
    marginLeft: 32,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontWeight: 'bold',
  },
  livre: {
    color: 'green',
  },
  entransit: {
    color: 'orange',
  },
  enattente: {
    color: 'red',
  },
});

export default OrderHistoryScreen;
