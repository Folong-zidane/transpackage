import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// Traductions simples
const translations = {
  en: {
    welcome: 'Welcome, {{name}}!',
    items: {
      one: '1 item',
      other: '{{count}} items'
    },
    addItem: 'Add Item',
    itemName: 'Item name',
    add: 'Add',
    cancel: 'Cancel',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this item?',
    changeLanguage: 'Change Language',
    noItems: 'No items added yet',
    enterItemName: 'Please enter an item name',
    settings: 'Settings',
    language: 'Language',
    shopping: 'Shopping List',
    total: 'Total: {{count}} items'
  },
  fr: {
    welcome: 'Bienvenue, {{name}} !',
    items: {
      one: '1 article',
      other: '{{count}} articles'
    },
    addItem: 'Ajouter un article',
    itemName: 'Nom de l\'article',
    add: 'Ajouter',
    cancel: 'Annuler',
    delete: 'Supprimer',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet article ?',
    changeLanguage: 'Changer de langue',
    noItems: 'Aucun article ajouté pour le moment',
    enterItemName: 'Veuillez saisir le nom d\'un article',
    settings: 'Paramètres',
    language: 'Langue',
    shopping: 'Liste de courses',
    total: 'Total : {{count}} articles'
  },
  es: {
    welcome: '¡Bienvenido, {{name}}!',
    items: {
      one: '1 artículo',
      other: '{{count}} artículos'
    },
    addItem: 'Agregar artículo',
    itemName: 'Nombre del artículo',
    add: 'Agregar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    confirmDelete: '¿Estás seguro de que quieres eliminar este artículo?',
    changeLanguage: 'Cambiar idioma',
    noItems: 'No se han agregado artículos aún',
    enterItemName: 'Por favor ingresa el nombre del artículo',
    settings: 'Configuración',
    language: 'Idioma',
    shopping: 'Lista de compras',
    total: 'Total: {{count}} artículos'
  }
};

// Fonction de traduction
const translate = (locale, key, options = {}) => {
  const keys = key.split('.');
  let value = translations[locale];

  for (const k of keys) {
    value = value?.[k];
  }

  // Pluralisation
  if (typeof value === 'object') {
    const count = options.count || 0;
    value = count <= 1 ? value.one : value.other;
  }

  // Remplacement des variables {{...}}
  if (typeof value === 'string') {
    Object.entries(options).forEach(([k, v]) => {
      value = value.replace(new RegExp(`{{${k}}}`, 'g'), v);
    });
  }

  return value || key;
};

const App = () => {
  const [currentLocale, setCurrentLocale] = useState('fr');
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [userName] = useState('Jean');
  const [showAddForm, setShowAddForm] = useState(false);

  const t = (key, options = {}) => translate(currentLocale, key, options);

  const addItem = () => {
    if (newItemName.trim() === '') {
      Alert.alert('Erreur', t('enterItemName'));
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      createdAt: new Date().toLocaleDateString()
    };

    setItems(prevItems => [...prevItems, newItem]);
    setNewItemName('');
    setShowAddForm(false);
  };

  const deleteItem = (itemId) => {
    Alert.alert(
      t('delete'),
      t('confirmDelete'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            setItems(prevItems => prevItems.filter(item => item.id !== itemId));
          }
        }
      ]
    );
  };

  const changeLanguage = () => {
    const languages = [
      { code: 'fr', name: 'Français' },
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' }
    ];

    Alert.alert(
      t('changeLanguage'),
      t('language'),
      languages.map(lang => ({
        text: lang.name,
        onPress: () => setCurrentLocale(lang.code)
      }))
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDate}>{item.createdAt}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteItem(item.id)}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <Text style={styles.title}>{t('shopping')}</Text>
        <TouchableOpacity style={styles.languageButton} onPress={changeLanguage}>
          <Text style={styles.languageButtonText}>🌐</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>
          {t('welcome', { name: userName })}
        </Text>
        <Text style={styles.countText}>
          {t('total', { count: items.length })}
        </Text>
      </View>

      <View style={styles.listContainer}>
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('noItems')}</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {showAddForm && (
        <View style={styles.addFormContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={t('itemName')}
            value={newItemName}
            onChangeText={setNewItemName}
            autoFocus
          />
          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setShowAddForm(false);
                setNewItemName('');
              }}
            >
              <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={addItem}
            >
              <Text style={styles.addButtonText}>{t('add')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!showAddForm && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setShowAddForm(true)}
        >
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
  },
  languageButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  languageButtonText: {
    fontSize: 20,
  },
  welcomeContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 5,
  },
  countText: {
    fontSize: 14,
    color: '#6c757d',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#343a40',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 12,
    color: '#6c757d',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 15,
    backgroundColor: '#dc3545',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  addFormContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#28a745',
    marginLeft: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App;