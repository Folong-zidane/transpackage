
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Modal, TextInput, Switch, Animated } from "react-native";
       
import { Card, Title } from 'react-native-paper';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { FAB } from "react-native-paper";

const { width: screenWidth } = Dimensions.get('window');

type Period = 'day' | 'week' | 'month';

interface StatsData {
  total: number;
  inTransit: number;
  delivered: number;
  chartData: any[];
  lineData: any;
}

export default function LogistiqueScreen({ navigation }: any) {

  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');
  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState<StatsData>({
    total: 0,
    inTransit: 0,
    delivered: 0,
    chartData: [],
    lineData: { labels: [], datasets: [] }
  });

  // Données simulées pour différentes périodes
  const generateMockData = (period: Period): StatsData => {
    let labels: string[] = [];
    let totalData: number[] = [];
    let transitData: number[] = [];
    let deliveredData: number[] = [];

    switch (period) {
      case 'day':
        labels = ['00h', '04h', '08h', '12h', '16h', '20h'];
        totalData = [12, 19, 25, 32, 28, 35];
        transitData = [8, 12, 18, 22, 18, 25];
        deliveredData = [4, 7, 7, 10, 10, 10];
        break;
      case 'week':
        labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        totalData = [45, 52, 48, 65, 59, 38, 42];
        transitData = [30, 35, 32, 45, 40, 25, 28];
        deliveredData = [15, 17, 16, 20, 19, 13, 14];
        break;
      case 'month':
        labels = ['S1', 'S2', 'S3', 'S4'];
        totalData = [180, 220, 195, 240];
        transitData = [120, 150, 130, 160];
        deliveredData = [60, 70, 65, 80];
        break;
    }

    const total = totalData.reduce((sum, val) => sum + val, 0);
    const inTransit = transitData.reduce((sum, val) => sum + val, 0);
    const delivered = deliveredData.reduce((sum, val) => sum + val, 0);

    return {
      total,
      inTransit,
      delivered,
      chartData: [
        {
          name: 'En transit',
          population: inTransit,
          color: '#2196F3',
          legendFontColor: '#333',
          legendFontSize: 12,
        },
        {
          name: 'Livrés',
          population: delivered,
          color: '#4CAF50',
          legendFontColor: '#333',
          legendFontSize: 12,
        },
      ],
      lineData: {
        labels,
        datasets: [
          {
            data: totalData,
            color: (opacity = 1) => `rgba(255, 107, 0, ${opacity})`,
            strokeWidth: 3,
          },
          {
            data: transitData,
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            strokeWidth: 2,
          },
          {
            data: deliveredData,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            strokeWidth: 2,
          },
        ],
        legend: ['Total', 'En transit', 'Livrés']
      }
    };
  };

  useEffect(() => {
    setIsLoading(true);
    // Simuler un petit délai de chargement
    setTimeout(() => {
      setStatsData(generateMockData(selectedPeriod));
      setIsLoading(false);
    }, 300);
  }, [selectedPeriod]);

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
    },
    propsForLabels: {
      fontSize: 12,
    },
  };

  const periodButtons = [
    { key: 'day' as Period, label: 'Jour', icon: 'today' },
    { key: 'week' as Period, label: 'Semaine', icon: 'calendar' },
    { key: 'month' as Period, label: 'Mois', icon: 'calendar-outline' },
  ];

  const getPeriodTitle = () => {
    switch (selectedPeriod) {
      case 'day': return 'Évolution aujourd\'hui';
      case 'week': return 'Évolution cette semaine';
      case 'month': return 'Évolution ce mois';
    }
  };

  {/** Section pour le Modal */}


  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState('entrepot');
  const [errors, setErrors] = useState({});
  const [loadingAnimation] = useState(new Animated.Value(0));
  
  // États pour Entrepôt
  const [entrepotData, setEntrepotData] = useState({
    nom: '',
    adresse: '',
    responsable: '',
    capaciteMax: '',
    type: 'point de collecte'
  });

  // États pour Colis
  const [colisData, setColisData] = useState({
    nom: '',
    types: 'roulant',
    longueur: '',
    largeur: '',
    hauteur: '',
    contenuDeclare: '',
    dateReceptionEntrepot: '',
    dateSortieEntrepot: '',
    priorite: 'standard',
    fragile: false,
    assurance: '',
    stockActuel: '',
    colisEnAttente: '',
    tauxRemplissage: '',
    destination: ''
  });

  // États pour Lot/Palettes
  const [lotData, setLotData] = useState({
    nom: '',
    nombreColis: '',
    description: '',
    destination: ''
  });

  // États pour Véhicules
  const [vehiculeData, setVehiculeData] = useState({
    nom: '',
    type: 'camion',
    capacite: '',
    statut: 'disponible',
    chauffeur: ''
  });

  const resetForms = () => {
    setEntrepotData({
      nom: '',
      adresse: '',
      responsable: '',
      capaciteMax: '',
      type: 'point de collecte'
    });
    setColisData({
      nom: '',
      types: 'roulant',
      longueur: '',
      largeur: '',
      hauteur: '',
      contenuDeclare: '',
      dateReceptionEntrepot: '',
      dateSortieEntrepot: '',
      priorite: 'standard',
      fragile: false,
      assurance: '',
      stockActuel: '',
      colisEnAttente: '',
      tauxRemplissage: '',
      destination: ''
    });
    setLotData({
      nom: '',
      nombreColis: '',
      description: '',
      destination: ''
    });
    setVehiculeData({
      nom: '',
      type: 'camion',
      capacite: '',
      statut: 'disponible',
      chauffeur: ''
    });
    setErrors({});
  };

  // Fonction de validation
  const validateForm = () => {
    const newErrors = {};

    switch (selectedTab) {
      case 'entrepot':
        if (!entrepotData.nom.trim()) newErrors.nom = 'Le nom est obligatoire';
        if (!entrepotData.adresse.trim()) newErrors.adresse = 'L\'adresse est obligatoire';
        if (!entrepotData.responsable.trim()) newErrors.responsable = 'Le responsable est obligatoire';
        if (!entrepotData.capaciteMax.trim()) newErrors.capaciteMax = 'La capacité maximale est obligatoire';
        break;

      case 'colis':
        if (!colisData.nom.trim()) newErrors.nom = 'Le nom est obligatoire';
        if (!colisData.longueur.trim()) newErrors.longueur = 'La longueur est obligatoire';
        if (!colisData.largeur.trim()) newErrors.largeur = 'La largeur est obligatoire';
        if (!colisData.hauteur.trim()) newErrors.hauteur = 'La hauteur est obligatoire';
        if (!colisData.contenuDeclare.trim()) newErrors.contenuDeclare = 'Le contenu déclaré est obligatoire';
        if (!colisData.destination.trim()) newErrors.destination = 'La destination est obligatoire';
        break;

      case 'lot':
        if (!lotData.nom.trim()) newErrors.nom = 'Le nom du lot est obligatoire';
        if (!lotData.nombreColis.trim()) newErrors.nombreColis = 'Le nombre de colis est obligatoire';
        if (!lotData.destination.trim()) newErrors.destination = 'La destination est obligatoire';
        break;

      case 'vehicule':
        if (!vehiculeData.nom.trim()) newErrors.nom = 'Le nom/immatriculation est obligatoire';
        if (!vehiculeData.capacite.trim()) newErrors.capacite = 'La capacité est obligatoire';
        if (!vehiculeData.chauffeur.trim()) newErrors.chauffeur = 'Le chauffeur est obligatoire';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    let dataToSave;
    switch (selectedTab) {
      case 'entrepot':
        dataToSave = entrepotData;
        break;
      case 'colis':
        dataToSave = colisData;
        break;
      case 'lot':
        dataToSave = lotData;
        break;
      case 'vehicule':
        dataToSave = vehiculeData;
        break;
    }
    
    // Fermer le modal principal et afficher le modal de succès
    setModalVisible(false);
    setSuccessModalVisible(true);
    
    // Démarrer l'animation de chargement
    loadingAnimation.setValue(0);
    Animated.timing(loadingAnimation, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: false,
    }).start();
    
    // Rediriger après 4 secondes
    setTimeout(() => {
      setSuccessModalVisible(false);
      resetForms();
      // Ici vous pouvez ajouter la navigation vers une autre page
      // navigation.navigate('AutrePage');
      console.log('Redirection vers une autre page...');
    }, 4000);
  };

  const renderSuccessModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={successModalVisible}
      onRequestClose={() => setSuccessModalVisible(false)}
    >
      <View style={styles.successModalOverlay}>
        <View style={styles.successModalContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Succès !</Text>
          <Text style={styles.successMessage}>
            Votre {selectedTab} a été créé{selectedTab === 'entrepot' ? '' : selectedTab === 'colis' ? '' : selectedTab === 'lot' ? '' : ''} avec succès.
          </Text>
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBar}>
              <Animated.View 
                style={[
                  styles.loadingProgress,
                  {
                    width: loadingAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  }
                ]} 
              />
            </View>
            <Text style={styles.loadingText}>Redirection en cours...</Text>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderEntrepotForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>🏢 Créer un Entrepôt</Text>
      
      <Text style={styles.label}>Nom <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={[styles.input, errors.nom && styles.inputError]}
        value={entrepotData.nom}
        onChangeText={(text) => setEntrepotData({...entrepotData, nom: text})}
        placeholder="Nom de l'entrepôt"
      />
      {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}

      <Text style={styles.label}>Adresse <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={[styles.input, errors.adresse && styles.inputError]}
        value={entrepotData.adresse}
        onChangeText={(text) => setEntrepotData({...entrepotData, adresse: text})}
        placeholder="Adresse complète"
        multiline
      />
      {errors.adresse && <Text style={styles.errorText}>{errors.adresse}</Text>}

      <Text style={styles.label}>Responsable <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={[styles.input, errors.responsable && styles.inputError]}
        value={entrepotData.responsable}
        onChangeText={(text) => setEntrepotData({...entrepotData, responsable: text})}
        placeholder="Nom du responsable"
      />
      {errors.responsable && <Text style={styles.errorText}>{errors.responsable}</Text>}

      <Text style={styles.label}>Capacité Max <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={[styles.input, errors.capaciteMax && styles.inputError]}
        value={entrepotData.capaciteMax}
        onChangeText={(text) => setEntrepotData({...entrepotData, capaciteMax: text})}
        placeholder="Capacité maximale"
        keyboardType="numeric"
      />
      {errors.capaciteMax && <Text style={styles.errorText}>{errors.capaciteMax}</Text>}

      <Text style={styles.label}>Type </Text>
      <View style={styles.pickerContainer}>
        {['point de collecte', 'entrepôt central', 'agence mobile'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.pickerOption,
              entrepotData.type === type && styles.pickerOptionSelected
            ]}
            onPress={() => setEntrepotData({...entrepotData, type})}
          >
            <Text style={[
              styles.pickerText,
              entrepotData.type === type && styles.pickerTextSelected
            ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderColisForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>📦 Créer un Colis</Text>
      
      <Text style={styles.label}>Nom <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={[styles.input, errors.nom && styles.inputError]}
        value={colisData.nom}
        onChangeText={(text) => setColisData({...colisData, nom: text})}
        placeholder="Nom du colis"
      />
      {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}

      <Text style={styles.label}>Type </Text>
      <View style={styles.pickerContainer}>
        {['roulant', 'mobile', 'fixe'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.pickerOption,
              colisData.types === type && styles.pickerOptionSelected
            ]}
            onPress={() => setColisData({...colisData, types: type})}
          >
            <Text style={[
              styles.pickerText,
              colisData.types === type && styles.pickerTextSelected
            ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Dimensions <Text style={styles.required}>*</Text></Text>
      <View style={styles.dimensionsContainer}>
        <View style={styles.dimensionInputContainer}>
          <TextInput
            style={[styles.input, styles.dimensionInput, errors.longueur && styles.inputError]}
            value={colisData.longueur}
            onChangeText={(text) => setColisData({...colisData, longueur: text})}
            placeholder="Longueur (cm)"
            keyboardType="numeric"
          />
          {errors.longueur && <Text style={styles.errorTextSmall}>{errors.longueur}</Text>}
        </View>
        <View style={styles.dimensionInputContainer}>
          <TextInput
            style={[styles.input, styles.dimensionInput, errors.largeur && styles.inputError]}
            value={colisData.largeur}
            onChangeText={(text) => setColisData({...colisData, largeur: text})}
            placeholder="Largeur (cm)"
            keyboardType="numeric"
          />
          {errors.largeur && <Text style={styles.errorTextSmall}>{errors.largeur}</Text>}
        </View>
        <View style={styles.dimensionInputContainer}>
          <TextInput
            style={[styles.input, styles.dimensionInput, errors.hauteur && styles.inputError]}
            value={colisData.hauteur}
            onChangeText={(text) => setColisData({...colisData, hauteur: text})}
            placeholder="Hauteur (cm)"
            keyboardType="numeric"
          />
          {errors.hauteur && <Text style={styles.errorTextSmall}>{errors.hauteur}</Text>}
        </View>
      </View>

      <Text style={styles.label}>Contenu Déclaré <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={[styles.input, errors.contenuDeclare && styles.inputError]}
        value={colisData.contenuDeclare}
        onChangeText={(text) => setColisData({...colisData, contenuDeclare: text})}
        placeholder="Description du contenu"
        multiline
      />
      {errors.contenuDeclare && <Text style={styles.errorText}>{errors.contenuDeclare}</Text>}

      <Text style={styles.label}>Date Réception Entrepôt</Text>
      <TextInput
        style={styles.input}
        value={colisData.dateReceptionEntrepot}
        onChangeText={(text) => setColisData({...colisData, dateReceptionEntrepot: text})}
        placeholder="JJ/MM/AAAA"
      />

      <Text style={styles.label}>Date Sortie Entrepôt</Text>
      <TextInput
        style={styles.input}
        value={colisData.dateSortieEntrepot}
        onChangeText={(text) => setColisData({...colisData, dateSortieEntrepot: text})}
        placeholder="JJ/MM/AAAA"
      />

      <Text style={styles.label}>Priorité </Text>
      <View style={styles.pickerContainer}>
        {['standard', 'express', 'urgent'].map((priorite) => (
          <TouchableOpacity
            key={priorite}
            style={[
              styles.pickerOption,
              colisData.priorite === priorite && styles.pickerOptionSelected
            ]}
            onPress={() => setColisData({...colisData, priorite})}
          >
            <Text style={[
              styles.pickerText,
              colisData.priorite === priorite && styles.pickerTextSelected
            ]}>
              {priorite}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Fragile</Text>
        <Switch
          value={colisData.fragile}
          onValueChange={(value) => setColisData({...colisData, fragile: value})}
        />
      </View>

      <Text style={styles.label}>Assurance (optionnelle)</Text>
      <TextInput
        style={styles.input}
        value={colisData.assurance}
        onChangeText={(text) => setColisData({...colisData, assurance: text})}
        placeholder="Montant de l'assurance"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Stock Actuel</Text>
      <TextInput
        style={styles.input}
        value={colisData.stockActuel}
        onChangeText={(text) => setColisData({...colisData, stockActuel: text})}
        placeholder="Nombre en stock"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Colis en Attente</Text>
      <TextInput
        style={styles.input}
        value={colisData.colisEnAttente}
        onChangeText={(text) => setColisData({...colisData, colisEnAttente: text})}
        placeholder="Nombre en attente"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Destination <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={[styles.input, errors.destination && styles.inputError]}
        value={colisData.destination}
        onChangeText={(text) => setColisData({...colisData, destination: text})}
        placeholder="Destination finale"
      />
      {errors.destination && <Text style={styles.errorText}>{errors.destination}</Text>}
    </View>
  );

  const renderLotForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>📦 Créer un Lot/Palette</Text>
      
      <Text style={styles.label}>Nom du Lot <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={[styles.input, errors.nom && styles.inputError]}
        value={lotData.nom}
        onChangeText={(text) => setLotData({...lotData, nom: text})}
        placeholder="Nom du lot"
      />
      {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}

      <Text style={styles.label}>Nombre de Colis <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={[styles.input, errors.nombreColis && styles.inputError]}
        value={lotData.nombreColis}
        onChangeText={(text) => setLotData({...lotData, nombreColis: text})}
        placeholder="Nombre de colis dans le lot"
        keyboardType="numeric"
      />
      {errors.nombreColis && <Text style={styles.errorText}>{errors.nombreColis}</Text>}

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={lotData.description}
        onChangeText={(text) => setLotData({...lotData, description: text})}
        placeholder="Description du lot"
        multiline
      />

      <Text style={styles.label}>Destination <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={[styles.input, errors.destination && styles.inputError]}
        value={lotData.destination}
        onChangeText={(text) => setLotData({...lotData, destination: text})}
        placeholder="Destination du lot"
      />
      {errors.destination && <Text style={styles.errorText}>{errors.destination}</Text>}
    </View>
  );

  const renderVehiculeForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>🚚 Créer un Véhicule</Text>
      
      <Text style={styles.label}>Nom/Immatriculation <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={[styles.input, errors.nom && styles.inputError]}
        value={vehiculeData.nom}
        onChangeText={(text) => setVehiculeData({...vehiculeData, nom: text})}
        placeholder="Nom ou immatriculation"
      />
      {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}

      <Text style={styles.label}>Type </Text>
      <View style={styles.pickerContainer}>
        {['camion', 'camionnette', 'vélo', 'moto'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.pickerOption,
              vehiculeData.type === type && styles.pickerOptionSelected
            ]}
            onPress={() => setVehiculeData({...vehiculeData, type})}
          >
            <Text style={[
              styles.pickerText,
              vehiculeData.type === type && styles.pickerTextSelected
            ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Capacité <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={[styles.input, errors.capacite && styles.inputError]}
        value={vehiculeData.capacite}
        onChangeText={(text) => setVehiculeData({...vehiculeData, capacite: text})}
        placeholder="Capacité (kg ou m³)"
        keyboardType="numeric"
      />
      {errors.capacite && <Text style={styles.errorText}>{errors.capacite}</Text>}

      <Text style={styles.label}>Statut </Text>
      <View style={styles.pickerContainer}>
        {['disponible', 'en cours', 'maintenance'].map((statut) => (
          <TouchableOpacity
            key={statut}
            style={[
              styles.pickerOption,
              vehiculeData.statut === statut && styles.pickerOptionSelected
            ]}
            onPress={() => setVehiculeData({...vehiculeData, statut})}
          >
            <Text style={[
              styles.pickerText,
              vehiculeData.statut === statut && styles.pickerTextSelected
            ]}>
              {statut}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Chauffeur <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={[styles.input, errors.chauffeur && styles.inputError]}
        value={vehiculeData.chauffeur}
        onChangeText={(text) => setVehiculeData({...vehiculeData, chauffeur: text})}
        placeholder="Nom du chauffeur"
      />
      {errors.chauffeur && <Text style={styles.errorText}>{errors.chauffeur}</Text>}
    </View>
  );




















  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header avec sélecteur de période */}
        <View style={styles.header}>
          <Title style={styles.mainTitle}>Tableau de bord</Title>
          <View style={styles.periodSelector}>
            {periodButtons.map((button) => (
              <TouchableOpacity
                key={button.key}
                style={[
                  styles.periodButton,
                  selectedPeriod === button.key && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(button.key)}
              >
                <Ionicons 
                  name={button.icon as any} 
                  size={16} 
                  color={selectedPeriod === button.key ? '#FFF' : '#FF6B00'} 
                />
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === button.key && styles.periodButtonTextActive
                ]}>
                  {button.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Statistiques rapides */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: '#FF6B00' }]}>
                  <Ionicons name="cube" size={24} color="#FFF" />
                </View>
                <Text style={styles.statValue}>{statsData.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: '#2196F3' }]}>
                  <Ionicons name="time" size={24} color="#FFF" />
                </View>
                <Text style={styles.statValue}>{statsData.inTransit}</Text>
                <Text style={styles.statLabel}>En transit</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: '#4CAF50' }]}>
                  <Ionicons name="checkmark-done" size={24} color="#FFF" />
                </View>
                <Text style={styles.statValue}>{statsData.delivered}</Text>
                <Text style={styles.statLabel}>Livrés</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Graphique en courbes */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <View style={styles.chartHeader}>
              <Title style={styles.chartTitle}>{getPeriodTitle()}</Title>
            </View>
            
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Chargement des données...</Text>
              </View>
            ) : (
              <View style={styles.lineChartContainer}>
                {statsData.lineData.labels.length > 0 && (
                  <LineChart
                    data={statsData.lineData}
                    width={screenWidth - 64}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    withInnerLines={false}
                    withOuterLines={true}
                    withVerticalLines={true}
                    withHorizontalLines={true}
                    fromZero={true}
                  />
                )}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Graphique en secteurs */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>Répartition des colis</Title>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Chargement des données...</Text>
              </View>
            ) : (
              <View style={styles.pieChartContainer}>
                {statsData.chartData.length > 0 && (
                  <PieChart
                    data={statsData.chartData}
                    width={screenWidth - 64}
                    height={200}
                    chartConfig={{
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                    hasLegend={true}
                  />
                )}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Graphique en barres */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>Comparaison détaillée</Title>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Chargement des données...</Text>
              </View>
            ) : (
              <View style={styles.barChartContainer}>
                {statsData.lineData.labels.length > 0 && statsData.lineData.datasets.length > 0 && (
                  <BarChart
                    data={{
                      labels: statsData.lineData.labels,
                      datasets: [{
                        data: statsData.lineData.datasets[0].data || []
                      }]
                    }}
                    width={screenWidth - 34}
                    height={200}
                    chartConfig={{
                      ...chartConfig,
                      color: (opacity = 1) => `rgba(255, 107, 0, ${opacity})`,
                    }}
                    style={styles.chart}
                    showValuesOnTopOfBars={true}
                    fromZero={true}
                  />
                )}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Résumé des performances */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>Résumé des performances</Title>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Chargement des données...</Text>
              </View>
            ) : (
              <>
                <View style={styles.summaryRow}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Taux de livraison</Text>
                    <Text style={styles.summaryValue}>
                      {statsData.total > 0 ? ((statsData.delivered / statsData.total) * 100).toFixed(1) : '0'}%
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Croissance</Text>
                    <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>+12%</Text>
                  </View>
                </View>
                <View style={styles.summaryRow}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Temps moyen</Text>
                    <Text style={styles.summaryValue}>2.3j</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Satisfaction</Text>
                    <Text style={[styles.summaryValue, { color: '#FF6B00' }]}>4.8/5</Text>
                  </View>
                </View>
              </>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/** la partie pour le modal de creation de logistique */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setModalVisible(true)}
      />
     
        
  
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Créer une Logistique</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
  
            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'entrepot' && styles.activeTab]}
                onPress={() => setSelectedTab('entrepot')}
              >
                <Text style={[styles.tabText, selectedTab === 'entrepot' && styles.activeTabText]}>
                  🏢 Entrepôt
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'colis' && styles.activeTab]}
                onPress={() => setSelectedTab('colis')}
              >
                <Text style={[styles.tabText, selectedTab === 'colis' && styles.activeTabText]}>
                  📦 Colis
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'lot' && styles.activeTab]}
                onPress={() => setSelectedTab('lot')}
              >
                <Text style={[styles.tabText, selectedTab === 'lot' && styles.activeTabText]}>
                  📦 Lot
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'vehicule' && styles.activeTab]}
                onPress={() => setSelectedTab('vehicule')}
              >
                <Text style={[styles.tabText, selectedTab === 'vehicule' && styles.activeTabText]}>
                  🚚 Véhicule
                </Text>
              </TouchableOpacity>
            </View>
  
            <ScrollView style={styles.modalContent}>
              {selectedTab === 'entrepot' && renderEntrepotForm()}
              {selectedTab === 'colis' && renderColisForm()}
              {selectedTab === 'lot' && renderLotForm()}
              {selectedTab === 'vehicule' && renderVehiculeForm()}
            </ScrollView>
  
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
  
        {renderSuccessModal()}
     

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  periodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  periodButtonActive: {
    backgroundColor: '#FF6B00',
  },
  periodButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B00',
  },
  periodButtonTextActive: {
    color: '#FFF',
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  chartCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  lineChartContainer: {
    alignItems: 'center',
  },
  pieChartContainer: {
    alignItems: 'center',
  },
  barChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loadingText: {
    fontStyle: 'italic',
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },

  // section pour creer une logistique

  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
   // Styles du Modal
   modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f9fa',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  
  // Styles des Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF6B00',
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  
  // Styles du contenu
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    paddingBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  required: {
    color: '#FF6B00',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#FF6B00',
    borderWidth: 2,
  
    marginBottom: 10,
  },
  errorText: {
    color: '#FF6B00',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    fontWeight: '500',
  },
  errorTextSmall: {
    color: '#FF6B00',
    fontSize: 10,
    marginTop: -10,
    marginBottom: 5,
    fontWeight: '500',
  },
  
  // Dimensions container
  dimensionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dimensionInputContainer: {
    flex: 1,
    marginRight: 6,
  },
  dimensionInput: {
    marginBottom: 0,
  },
  
  // Picker styles
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  pickerOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  pickerOptionSelected: {
    backgroundColor: '#FF6B00',
  },
  pickerText: {
    fontSize: 14,
    color: '#666',
  },
  pickerTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  // Switch container
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  
  // Footer
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f8f9fa',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: '#FF6B00',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },

  // Styles du Modal de Succès
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    maxWidth: 320,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successIconText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
});