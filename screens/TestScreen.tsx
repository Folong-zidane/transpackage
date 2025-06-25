
import { StyleSheet,Button, Text, View } from "react-native";
import { ScrollView, StatusBar, TouchableOpacity, Image } from 'react-native';
import React from "react";
import { FAB } from "react-native-paper";
import { useNotifications } from "../contexts/NotificationContext";


export default function TestScreen() {
  const { addNotification } = useNotifications();
  
  const handleAddNotification = () => {
    addNotification({
      title: "Nouveau colis enregistré",
      message: "Votre colis #XY12345 a été pris en charge",
      type: "info",
      read: false,
      packageId: "XY12345",
      actionType: "trackPackage",
    });
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Hello World (Test)</Text>
      <Text style={styles.subtitle}>This is the first page for test your app.</Text>
      <View style={styles.buttonContainer}>
          <Button title="Test" onPress={() => console.log('Test est cliqué')} />
      </View>

    <FAB
      style={styles.fab}
      icon="plus"
      onPress={handleAddNotification}
      // label="Ajouter"
    />
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  buttonContainer: {
    alignSelf: 'center',
    width: '50%',
    color: '#555',
    fontWeight: 'bold',
    margin: 10,
    backgroundColor: 'orange',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },

});

// cest bon ici
// 