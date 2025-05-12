import React, {useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const dummyData = [
  {id: '1', name: 'Point Relais Alpha', subtitle: 'Douala – Bonanjo'},
  {id: '2', name: 'Point Relais Beta', subtitle: 'Yaoundé – Melen'},
  {id: '3', name: 'Point Relais Gamma', subtitle: 'Bafoussam – Quartier Autonome'},
  {id: '4', name: 'Point Relais Delta', subtitle: 'Limbe – Waterfront'},
  {id: '5', name: 'Point Relais Epsilon', subtitle: 'Bamenda – Mile 3'},
  {id: '6', name: 'Point Relais Zeta', subtitle: 'Kribi – Plage Centrale'},
  {id: '7', name: 'Point Relais Eta', subtitle: 'Garoua – Secteur 6'},
  {id: '8', name: 'Point Relais Theta', subtitle: 'Mokolo – Centre-ville'},
  {id: '9', name: 'Point Relais Iota', subtitle: 'Ebolowa – Marché Central'},
  {id: '10', name: 'Point Relais Kappa', subtitle: 'Buea – University Corner'},
];

export default function HomeScreen({navigation}) {
  const [search, setSearch] = useState('');

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('Details', {point: item})}
    >
      <View style={styles.itemHeader}>
        <Icon name="local-shipping" size={24} color="#007AFF" />
        <Text style={styles.itemName}>{item.name}</Text>
      </View>
      <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Agence de Livraison 📦</Text>
        <Text style={styles.subtitle}>
          Trouvez votre point relais le plus proche
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" />
        <TextInput
          placeholder="Rechercher un point relais..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={dummyData.filter(item =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8fa',
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e1e9f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});
