
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AssistantScreen() {
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis votre assistant Pick&Drop. Comment puis-je vous aider avec vos colis aujourd\'hui ?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Réponses prédéfinies pour simuler l'assistant
  const getAutoResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('suivi') || message.includes('track')) {
      return 'Pour suivre votre colis, rendez-vous dans l\'onglet "Mes Colis" ou donnez-moi votre numéro de suivi.';
    }
    if (message.includes('point relais') || message.includes('retrait')) {
      return 'Vous pouvez trouver le point relais le plus proche dans l\'onglet "Carte" ou me donner votre adresse pour vous aider.';
    }
    if (message.includes('horaire') || message.includes('ouvert')) {
      return 'Les horaires des points relais varient. Consultez les détails du point relais dans l\'application ou demandez-moi l\'adresse spécifique.';
    }
    if (message.includes('livraison') || message.includes('délai')) {
      return 'Les délais de livraison sont généralement de 24-48h pour les points relais. Voulez-vous vérifier un colis spécifique ?';
    }
    if (message.includes('problème') || message.includes('aide')) {
      return 'Je suis là pour vous aider ! Pouvez-vous me décrire votre problème plus précisément ?';
    }
    if (message.includes('bonjour') || message.includes('bonsoir') || message.includes('salut')) {
      return 'Bonjour ! Ravi de vous aider avec Pick&Drop. Que puis-je faire pour vous ?';
    }
    
    return 'Je comprends votre demande. Pour une assistance personnalisée, vous pouvez aussi contacter notre service client au 656912897.';
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsTyping(true);

    // Simuler une réponse automatique après un délai
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutoResponse(inputText),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  useEffect(() => {
    // Auto-scroll vers le bas quand de nouveaux messages arrivent
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.assistantMessage,
      ]}
    >
      <Text style={[
        styles.messageText,
        message.isUser ? styles.userMessageText : styles.assistantMessageText,
      ]}>
        {message.text}
      </Text>
      <Text style={[
        styles.timestamp,
        message.isUser ? styles.userTimestamp : styles.assistantTimestamp,
      ]}>
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );

  const quickActions = [
    { id: '1', text: 'Suivre un colis', action: () => setInputText('Je veux suivre mon colis') },
    { id: '2', text: 'Trouver un point relais', action: () => setInputText('Où est le point relais le plus proche ?') },
    { id: '3', text: 'Horaires d\'ouverture', action: () => setInputText('Quels sont les horaires ?') },
    { id: '4', text: 'Problème de livraison', action: () => setInputText('J\'ai un problème avec ma livraison') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B00" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assistant Pick&Drop</Text>
        <View style={styles.statusIndicator}>
          <View style={styles.onlineIndicator} />
          <Text style={styles.statusText}>En ligne</Text>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          
          {isTyping && (
            <View style={[styles.messageContainer, styles.assistantMessage]}>
              <Text style={styles.typingText}>Assistant en train d'écrire...</Text>
            </View>
          )}

          {/* Actions rapides (affichées seulement au début) */}
          {messages.length <= 2 && (
            <View style={styles.quickActionsContainer}>
              <Text style={styles.quickActionsTitle}>Actions rapides :</Text>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickActionButton}
                  onPress={action.action}
                >
                  <Text style={styles.quickActionText}>{action.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Tapez votre message..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() === '' ? styles.sendButtonDisabled : null
            ]}
            onPress={sendMessage}
            disabled={inputText.trim() === ''}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FF6B00',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF6B00',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFF',
  },
  assistantMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: '#FFD4B3',
    textAlign: 'right',
  },
  assistantTimestamp: {
    color: '#999',
  },
  typingText: {
    color: '#666',
    fontStyle: 'italic',
    fontSize: 14,
  },
  quickActionsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 1,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  quickActionButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  quickActionText: {
    color: '#FF6B00',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#F8F9FA',
  },
  sendButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});