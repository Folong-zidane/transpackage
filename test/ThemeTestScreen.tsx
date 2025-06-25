// screens/ThemeTestScreen.tsx
import React from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Text as RNText,
} from 'react-native'
import {
  Text,
  Card,
  Button,
  IconButton,
  Chip,
  Switch,
  TextInput,
  FAB,
  Snackbar,
  ProgressBar,
  Divider,
  Avatar,
  Badge,
  Surface,
  SegmentedButtons,
} from 'react-native-paper'
import { useTheme } from '../contexts/ThemeContext'

const ThemeTestScreen: React.FC = () => {
  const { theme, themeMode, setThemeMode, isDarkMode } = useTheme()
  const [switchValue, setSwitchValue] = React.useState(false)
  const [snackbarVisible, setSnackbarVisible] = React.useState(false)
  const [segmentedValue, setSegmentedValue] = React.useState('light')
  const [textInput, setTextInput] = React.useState('')

  const handleThemeChange = (value: string) => {
    setSegmentedValue(value)
    setThemeMode(value as 'light' | 'dark' | 'auto')
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* En-tête avec informations du thème */}
      <Surface style={styles.header} elevation={1}>
        <Text variant="headlineMedium" style={styles.title}>
          Test des Thèmes
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Mode actuel: {themeMode} | Sombre: {isDarkMode ? 'Oui' : 'Non'}
        </Text>
      </Surface>

      {/* Sélecteur de thème */}
      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Sélecteur de Thème
          </Text>
          <SegmentedButtons
            value={segmentedValue}
            onValueChange={handleThemeChange}
            buttons={[
              { value: 'light', label: 'Clair' },
              { value: 'dark', label: 'Sombre' },
              { value: 'auto', label: 'Auto' },
            ]}
            style={styles.segmentedButtons}
          />
        </Card.Content>
      </Card>

      {/* Test des couleurs principales */}
      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Couleurs Principales
          </Text>
          <View style={styles.colorRow}>
            <View style={[styles.colorBox, { backgroundColor: theme.colors.primary }]}>
              <Text style={{ color: theme.colors.onPrimary }}>Primary</Text>
            </View>
            <View style={[styles.colorBox, { backgroundColor: theme.colors.secondary }]}>
              <Text style={{ color: theme.colors.onSecondary }}>Secondary</Text>
            </View>
            <View style={[styles.colorBox, { backgroundColor: theme.colors.tertiary }]}>
              <Text style={{ color: theme.colors.onTertiary }}>Tertiary</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Test des boutons */}
      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Boutons
          </Text>
          <View style={styles.buttonRow}>
            <Button mode="contained" onPress={() => setSnackbarVisible(true)}>
              Contained
            </Button>
            <Button mode="outlined" onPress={() => setSnackbarVisible(true)}>
              Outlined
            </Button>
            <Button mode="text" onPress={() => setSnackbarVisible(true)}>
              Text
            </Button>
          </View>
          <View style={styles.buttonRow}>
            <IconButton icon="heart" mode="contained" />
            <IconButton icon="star" mode="outlined" />
            <IconButton icon="plus" />
          </View>
        </Card.Content>
      </Card>

      {/* Test des surfaces et élévations */}
      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Surfaces et Élévations
          </Text>
          <View style={styles.surfaceRow}>
            {[0, 1, 2, 3, 4, 5].map((level) => (
              <Surface
                key={level}
                style={[styles.elevationBox, { backgroundColor: theme.colors.elevation[`level${level}` as keyof typeof theme.colors.elevation] }]}
                elevation={level}
              >
                <Text variant="labelSmall">Level {level}</Text>
              </Surface>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Test des typographies */}
      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Typographies
          </Text>
          <Text variant="headlineLarge">Headline Large</Text>
          <Text variant="headlineMedium">Headline Medium</Text>
          <Text variant="headlineSmall">Headline Small</Text>
          <Text variant="titleLarge">Title Large</Text>
          <Text variant="titleMedium">Title Medium</Text>
          <Text variant="titleSmall">Title Small</Text>
          <Text variant="bodyLarge">Body Large - Lorem ipsum dolor sit amet</Text>
          <Text variant="bodyMedium">Body Medium - Lorem ipsum dolor sit amet</Text>
          <Text variant="bodySmall">Body Small - Lorem ipsum dolor sit amet</Text>
          <Text variant="labelLarge">Label Large</Text>
          <Text variant="labelMedium">Label Medium</Text>
          <Text variant="labelSmall">Label Small</Text>
        </Card.Content>
      </Card>

      {/* Test des composants interactifs */}
      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Composants Interactifs
          </Text>
          
          <TextInput
            label="Champ de texte"
            value={textInput}
            onChangeText={setTextInput}
            style={styles.textInput}
          />

          <View style={styles.switchRow}>
            <Text variant="bodyMedium">Switch activé</Text>
            <Switch value={switchValue} onValueChange={setSwitchValue} />
          </View>

          <ProgressBar progress={0.7} style={styles.progressBar} />

          <View style={styles.chipRow}>
            <Chip icon="heart" onPress={() => {}}>Chip 1</Chip>
            <Chip mode="outlined" onPress={() => {}}>Chip 2</Chip>
            <Chip selected onPress={() => {}}>Selected</Chip>
          </View>
        </Card.Content>
      </Card>

      {/* Test des avatars et badges */}
      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Avatars et Badges
          </Text>
          <View style={styles.avatarRow}>
            <View>
              <Avatar.Text size={48} label="AB" />
              <Badge style={styles.badge}>3</Badge>
            </View>
            <Avatar.Icon size={48} icon="account" />
            <Avatar.Image 
              size={48} 
              source={{ uri: 'https://via.placeholder.com/48' }} 
            />
          </View>
        </Card.Content>
      </Card>

      {/* Test des couleurs d'état */}
      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Couleurs d'État
          </Text>
          <View style={styles.colorRow}>
            <View style={[styles.colorBox, { backgroundColor: theme.colors.error }]}>
              <Text style={{ color: theme.colors.onError }}>Error</Text>
            </View>
            <View style={[styles.colorBox, { backgroundColor: theme.colors.errorContainer }]}>
              <Text style={{ color: theme.colors.onErrorContainer }}>Error Container</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Divider style={styles.divider} />

      {/* Informations techniques */}
      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Informations Techniques
          </Text>
          <Text variant="bodySmall">Roundness: {theme.roundness}px</Text>
          <Text variant="bodySmall">
            Couleur de fond: {theme.colors.background}
          </Text>
          <Text variant="bodySmall">
            Couleur de surface: {theme.colors.surface}
          </Text>
          <Text variant="bodySmall">
            Couleur primaire: {theme.colors.primary}
          </Text>
        </Card.Content>
      </Card>

      {/* FAB flottant */}
      <FAB
        icon="palette"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setSnackbarVisible(true)}
      />

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        Thème testé avec succès !
      </Snackbar>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  section: {
    margin: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginTop: 8,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  colorBox: {
    width: 80,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  surfaceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  elevationBox: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 8,
  },
  textInput: {
    marginVertical: 10,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  progressBar: {
    marginVertical: 10,
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  divider: {
    marginVertical: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})

export default ThemeTestScreen