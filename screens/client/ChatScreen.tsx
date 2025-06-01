// ChatScreen.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = () => {
  const navigation = useNavigation();
  const handleChatPress = () => {
    Alert.alert('Bouton cliqué', 'Vous avez appuyé sur « Chater ».');
    console.log('Bouton cliqué');
    // Ici, vous pouvez naviguer vers un autre écran ou lancer votre logique de chat.
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleChatPress}
        style={[styles.actionButton, { backgroundColor: '#FF6B00' }]}
      >
        <Text style={styles.buttonText}>Chater</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',      // centre verticalement
    alignItems: 'center',          // centre horizontalement
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,                  // ombre sous Android
    shadowColor: '#000',           // ombre sous iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
