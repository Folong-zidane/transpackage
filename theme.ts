import { MD3LightTheme, configureFonts } from "react-native-paper"

// Définir des tailles de police plus grandes pour l'accessibilité
const fontConfig = {
  fontFamily: "System",
  fontWeights: {
    regular: "400",
    medium: "500",
    bold: "700",
  },
  sizes: {
    small: 14,
    medium: 16,
    large: 18,
    extraLarge: 22,
  },
}

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#FF6B00",
    secondary: "#2196F3",
    tertiary: "#4CAF50",
    error: "#FF3B30",
    background: "#F5F5F5",
    surface: "#FFFFFF",
    // Améliorer le contraste pour l'accessibilité
    onBackground: "#121212",
    onSurface: "#121212",
    onPrimary: "#FFFFFF",
    onSecondary: "#FFFFFF",
    onTertiary: "#FFFFFF",
    onError: "#FFFFFF",
  },
  fonts: configureFonts({ config: fontConfig }),
  // Augmenter la taille des éléments interactifs pour l'accessibilité
  roundness: 8,
}
