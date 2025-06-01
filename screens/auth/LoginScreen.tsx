
import { useState } from "react"
import { View, StyleSheet,ScrollView , TouchableOpacity, Image } from "react-native"
import { TextInput, Button, Text, SegmentedButtons } from "react-native-paper"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigation } from "@react-navigation/native"
import * as Animatable from "react-native-animatable"

const LoginScreen = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState<"client" | "agency">("client")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const navigation = useNavigation()

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs")
      return
    }

    setLoading(true)
    setError("")

    try {
      await login(email, password, userType)
    } catch (err) {
      setError("Échec de connexion. Veuillez vérifier vos identifiants.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="fadeIn" duration={1000} style={styles.logoContainer}>
        <Image source={require("../../assets/Logo_Pick&Drop.png")} style={styles.logo} />
        <Text style={styles.appTitle}>Pick&Drop Link</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={800} delay={300} style={styles.formContainer}>
        <Text style={styles.title}>Connexion</Text>

        <SegmentedButtons
          value={userType}
          onValueChange={(value) => setUserType(value as "client" | "agency")}
          buttons={[
            { value: "client", label: "Client" },
            { value: "agency", label: "Agence" },
          ]}
          style={styles.segmentedButtons}
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="email" />}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry
          left={<TextInput.Icon icon="lock" />}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          style={styles.loginButton}
          contentStyle={styles.buttonContent}
        >
          Se connecter
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate("Register" as never)} style={styles.registerLink}>
          <Text style={styles.registerText}>Pas encore de compte ? S'inscrire</Text>
        </TouchableOpacity>
      </Animatable.View>
    </ScrollView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: "#FF6B00",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  loginButton: {
    marginTop: 10,
    backgroundColor: "#FF6B00",
  },
  buttonContent: {
    paddingVertical: 8,
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    color: "#FF6B00",
  },
})

export default LoginScreen
