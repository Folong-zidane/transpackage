
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  StatusBar, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { Card, Title } from 'react-native-paper';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

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
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});